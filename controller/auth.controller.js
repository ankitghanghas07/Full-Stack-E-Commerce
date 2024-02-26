const User = require("../models/user.model");
const sessionFlash = require("../util/session-flash");

function getSignUp(req, res) {
  let sessionData = sessionFlash.getFlashData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
      name: "",
      stree: "",
      city: "",
      pincode: "",
    };
  }
  res.render("customer/auth/signup", { enteredData: sessionData });
}

function isEmptyField(value) {
  return !value || !value.trim().length;
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    street: req.body.street,
    city: req.body.city,
    pincode: req.body.pincode,
  };

  // check for any empty field in signup form.
  if (
    isEmptyField(enteredData.email) ||
    isEmptyField(req.body.password) ||
    isEmptyField(req.body.street) ||
    isEmptyField(req.body.city) ||
    isEmptyField(req.body.pincode) ||
    !req.body.email.includes("@") ||
    !(req.body.password.trim().length >= 6)
  ) {
    console.log("validation error..");
    sessionFlash.flashDataOnSession(
      req,
      {
        errorMessage:
          "Incorrect data. Please check for any empty input or invalid email or password less than 6 characters long.",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    enteredData.email,
    enteredData.password,
    enteredData.name,
    enteredData.street,
    enteredData.city,
    enteredData.pincode
  );

  try {
    // check for existing user.
    const existingUser = await user.getUserWithSameEmail();
    if (existingUser) {
      console.log("validation error..");
      sessionFlash.flashDataOnSession(
        req,
        {
          errorMessage:
            "User with same eamil already exists. Please consider Logging in..",
          ...enteredData,
        },
        function () {
          return res.redirect("/signup");
        }
      );
      return;
    }
    await user.signup();
  } catch (error) {
    return next(error);
  }

  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getFlashData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("customer/auth/login", { enteredData: sessionData }); // this path is relative to 'views' folder.
}


async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    return next(error);
  }

  const sessionData = {
    errorMessage: "Invalid credentials. Please enter carefully.",
    email: req.body.email,
    password: req.body.password,
  };

  if (!existingUser) {
    return sessionFlash.flashDataOnSession(req, sessionData, function () {
      return res.redirect("/login");
    });
  }

  let isPasswordCorrect;
  try {
    isPasswordCorrect = await user.hasCorrectPassword(existingUser.password);
  } catch (error) {
    return next(error);
  }

  if (!isPasswordCorrect) {
    return sessionFlash.flashDataOnSession(req, sessionData, function () {
      return res.redirect("/login");
    });
  }

  // create session
  req.session.uid = existingUser._id.toString();
  req.session.isAdmin = existingUser.isAdmin;

  // req.session.save(callback)
  req.session.save(function () {
    res.redirect("/");
  });
}

async function logout(req, res) {
  req.session.destroy(function (error) {
  });
  res.redirect("/");
}

module.exports = {
  getSignUp: getSignUp,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
