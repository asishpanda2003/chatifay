import genToken from "../config/token.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const checkUserByUsername = await User.findOne({ userName });
    if (checkUserByUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const checkUserByEmail = await User.findOne({ email });
    if (checkUserByEmail) {
      return res.status(400).json({ message: "email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashesPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashesPassword,
    });
    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      sameSite:"None",
      secure:true
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `signup error ${error}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user doesnot exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Login error ${error}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: `Logout error ${error}` });
  }
};
