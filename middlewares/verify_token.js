import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ msg: "You're not authenticated person", Error: err.message });
    }
    req.user = decoded;
    next();
  });
};
