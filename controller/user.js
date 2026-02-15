import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userController = {
  registerUser: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      if (!name || !email || !password) {
        return res.json({
          success: false,
          message: "All details are required...",
        });
      }

      const checkExists = await User.find({ email: email });
      console.log(checkExists);
      if (checkExists.length !== 0) {
        return res.json({
          success: false,
          message: "Account already exists, please login",
        });
      }
      const hashPassword = await bcrpyt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashPassword,
      });
      newUser.save();

      return res.json({
        success: true,
        message: "User registered successfully!",
      });
    } catch (error) {
      return res.json({
        success: false,
        error: error.message,
      });
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    console.log("Email", email, "Password", password);
    try {
      if (!email || !password) {
        return res.json({
          success: false,
          message: "All fields are required.",
        });
      }
      const checkExists = await User.find({ email: email });
      console.log(checkExists);
      if (checkExists.length == 0) {
        return res.json({
          success: false,
          message: "Account , doesn't exists.",
        });
      }

      bcrypt.compare(password, checkExists[0].password, (err, result) => {
        console.log(result);
        if (result) {
          const token = jwt.sign(
            { id: checkExists._id, email: checkExists.email },
            process.env.SECRET_KEY,
            {
              expiresIn: "1h",
            },
          );
          return res.status(200).send({
            msg: "Logged In Successfully",
            token: token,
            user: checkExists,
          });
        } else {
          console.error("Error", err);
          return res.status(404).send({ err: err });
        }
      });
    } catch (error) {
      return res.status(400).send({ error: error });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      let findUser = await User.findById({ _id: userId });

      if (!findUser) {
        return res.status(404).send({ msg: "user not found" });
      }

      await User.findByIdAndDelete({ _id: userId });
      res.status(200).send({ msg: "User deleted successfully" });
    } catch (error) {
      res.status(403).json({
        status: false,
        message: error.message,
      });
    }
  },
  logoutUser: async (req, res) => {
    res.status(200).send({ msg: "User has logged out successfully" });
  },
};

export default userController;
