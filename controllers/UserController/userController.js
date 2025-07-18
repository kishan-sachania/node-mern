const UserModel = require("../../models/user/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//register
const register_user = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existUser = await UserModel.findOne({ username });

    if (existUser) {
      res.status(409).json({ message: "User already exists" });
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
  }
};

//login
const login_user = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username);
    const user = await UserModel.findOne({ username });

    if (!user) {
      res.status(401).json({ message: "User Not Found" });
      return;
    }

    const passMatch = await bcrypt.compare(password, user.password);
    console.log("PassMatch");
    if (!passMatch) {
      res.status(401).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true, // Use HTTPS if forwarded through HTTPS
      sameSite: "None", // None for cross-origin HTTPS
      maxAge: 3600000,
      path: "/",
    });
    console.log("Response headers:", res.getHeaders());
    res.status(200).json({ message: "Login Success" });
  } catch (err) {
    console.error(err);
  }
};

//verify token
const auth = (req, res, next) => {
  // Try cookie first, then Authorization header
  let token = req.cookies.authToken;
  console.log("auth", token);
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
  }

  console.log("Token from cookie or header:", token);

  if (!token) return res.status(401).json({ error: "Access Denied" });

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
};
