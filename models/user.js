const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto"); // crypto is a built in package which is used in password hashing
const { createTokenForUser } = require("../services/authentication");
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    salt: {
      // for hashing the password
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  //basically this is a presave middleware
  // during saving of the user , this middleware will work in bw
  const user = this; /// here 'this' points to the current user

  // for the new password - hashing is done
  const salt = randomBytes(16).toString(); // this salt is just a random string

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex"); // the algorithm used is sha256

  this.salt = salt;
  this.password = hashedPassword;

  next();
});






userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    // the keyword static is used for static method that can be directly called on the model(' eg User.matchPassword(..))

    const user = await this.findOne({ email });
    // console.log(user);
    /// here this refers to the model User itself not an instance of the model

    if (!user) throw new Error("User not found");
   
      const salt = user.salt;
      const hashedPassword = user.password;
      const userProvidedHashedPass = createHmac("sha256", salt)
        .update(password)
        .digest("hex");
      

    if (hashedPassword !== userProvidedHashedPass)
      throw new Error("Incorrect Password");
    else {
      // return user; // pura user object return kra diya

      const token = createTokenForUser(user);
      return token;
    }
  }
);

const User = model("user", userSchema);

module.exports = User;
 