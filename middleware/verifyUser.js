const jwt = require("jsonwebtoken");

const fetchIds = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        console.log("no token");
        return res
          .status(401)
          .send({ success: false, errorMessage: "Access Denied" });
      } else {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
      }
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json({ success: false, errorMessage: "Access Denied" });
    }
  } else {
    console.log("no token 2");
    return res
      .status(401)
      .send({ success: false, errorMessage: "Access Denied" });
  }
};

module.exports = fetchIds;
