const User = require("../model/user");
const bcrypt = require("bcryptjs");

async function handleUserSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    // Check whether the email already exists
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });

    if (existingUser) {
      return res.status(409).send("Email is already registered");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    return res.redirect("/user/login");
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).send("Unable to register user");
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Invalid email or password");
    }

    // Prevent session fixation by creating a fresh session ID
    req.session.regenerate((error) => {
      if (error) {
        console.error("Session error:", error);
        return res.status(500).send("Unable to log in");
      }

      req.session.userId = user._id.toString();

      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("Session save error:", saveErr);
          return res.status(500).send("Unable to log in");
        }

        return res.redirect("/");
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Unable to log in");
  }
}

function handleUserLogout(req, res) {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
      res.clearCookie("url_shortener_sid");
      return res.redirect("/user/login");
    });
  } else {
    return res.redirect("/user/login");
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
};