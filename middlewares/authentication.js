//install the package npm i cookieparser

const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
    return  next();               //yha return lgana jaruri h kyun hame sirf next() krke niche ki execution nhi krani  
    }

    else {

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
           return next();
          } catch (error) {}
        return  next();
    } 
   
  };
}


module.exports= {
    checkForAuthenticationCookie,
}