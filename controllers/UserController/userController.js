const UserModel = require("../../models/user/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { default: axios } = require("axios");

//register
const register_user = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existUser = await UserModel.findOne({ username });

    if (existUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    //generate hash password
    const hashPassword = await bcrypt.hash(password, 10);
    //user with new encrypt password
    const user = new UserModel({ username, password: hashPassword });

    //save to mongo
    await user.save();
    res.status(201).json({ message: "User Register Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//login
const login_user = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt for username:", username);

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    const passMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", passMatch);

    if (!passMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set cookie with appropriate settings for Railway
    res.cookie("authToken", token, {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "lax",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login Success", token }); // Also return token for debugging
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//send otp
const send_otp = async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber;
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(mobileNumber, otp);
    await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: process.env.FAST_API_KEY,
        route: "otp",
        variables_values: otp.toString(),
        numbers: mobileNumber,
      },
      headers: { "cache-control": "no-cache" },
    });
    res.json({ success: true, message: "OTP send successfully!" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
};

//verify token
const auth = (req, res, next) => {
  // Try cookie first, then Authorization header
  let token = req.cookies.authToken;
  console.log("Cookie token:", token);

  console.log("Final token:", token);
  console.log("All cookies:", req.cookies);

  if (!token) {
    return res.status(401).json({ error: "Access Denied - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = {
  register_user,
  login_user,
  auth,
  send_otp,
};
