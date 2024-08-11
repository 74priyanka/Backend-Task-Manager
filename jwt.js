const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  //first check request headers has authorization or not
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .json({ message: "you are not authorized to access the resource" });
  }

  //extract the jwt token
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "token not found or unauthorized" });
  }

  try {
    //verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //add the decoded user to the request object
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "invalid token" });
  }
};

//function to generate the JWT token
const generateToken = (user) => {
  //generate a new JWT token using user data
  return jwt.sign({ user }, process.env.JWT_SECRET);
};

module.exports = { jwtAuthMiddleware, generateToken };
