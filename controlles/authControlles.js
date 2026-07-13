const User = require("../models/User");
const Books = require("../models/Books");
const Borrow = require("../models/Borrow");
const jwt = require("jsonwebtoken");
const requireAuth = require("../middelware/authMiddelware");


const maxAge = 1000 * 60 * 60 * 60 * 24;

const handelError = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "Incorrect Email") {
    errors.email = "this email is not register";
  }
  if (err.message === "Incorrect Password") {
    errors.password = "this password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "this email already exist";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const handelBookError = (err) => {
  let errors = { title: "", author: "", ISBN: "" };

  if (err.code === 11000) {
    errors.book = "this book already exist";
    return errors;
  }
  if (err.message.includes("book validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
const createtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports.home_get = async (req, res) => {
  const today = new Date();
  const miltoday = 1000 * 60 * 60 * 24;

  if (!req.user) {
    res.render("index", { borrowdata: [] });
  } else {
    const userid = req.user._id;
    if (req.user.role === "admin") {
      const totalUser = await User.countDocuments();
      const totalBook = await Books.countDocuments();
      const totalBorrowed = await Borrow.countDocuments({ status: "borrowed" });
      res.render("index", {
        borrowdata: [],
        totalUser,
        totalBook,
        totalBorrowed,
      });
    } else {
      const borrowStats = await Borrow.find({
    user: userid
}).populate('book');

const borrowdata = await Borrow.find({
    user: userid,
    status: 'borrowed'
}).populate('book');

      for (const borrow of borrowdata) {
        if (borrow.status === "returned") continue;

        borrow.message = "";

        const diffinmill = borrow.dueDate - today;
        const remainingtime = Math.ceil(diffinmill / miltoday);

        if (remainingtime < 2) {
          borrow.message = `Only ${remainingtime} day${remainingtime === 1 ? "" : "s"} remaining to return ${borrow.book.title}`;
        } else if (remainingtime < 5) {
          borrow.message = `Only ${remainingtime} days remaining to return ${borrow.book.title}`;
        } else if (remainingtime < 8) {
          borrow.message = `Only ${remainingtime} days remaining to return ${borrow.book.title}`;
        } else if (remainingtime < 10) {
          borrow.message = `Only ${remainingtime} days remaining to return ${borrow.book.title}`;
        }
      }

      res.render('index', {
    borrowdata,
    borrowStats
});
    }
  }
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    const token = createtoken(user._id);
    res.cookie("jwt", token, { httpOnly: true });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const handelerror = handelError(err);
    res.status(400).json({ errors: handelerror });
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createtoken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const handelerror = handelError(err);
    res.status(400).json({ errors: handelerror });
  }
};
module.exports.books_get = (req, res) => {
  res.render("Books");
};
module.exports.books_post = async (req, res) => {
  const { title, author, ISBN, quantity } = req.body;
  try {
    const book = await Books.create({ title, author, ISBN, quantity });
    res.status(200).json({ book: book._id });
  } catch (err) {
    const handelerror = handelBookError(err);
    res.status(400).json({ errors: handelerror });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.view_books_get = async (req, res) => {
  const books = await Books.find();
  res.render("viewbooks", { books });
};
module.exports.users_get = async (req, res) => {
  const users = await User.find();
  res.render("users", { users });
};

module.exports.change_role_post = async (req, res) => {
  try {
    const userid = req.params.id;
    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.role === "user") {
      user.role = "admin";
    } else {
      user.role = "user";
    }

    await user.save();

    res.redirect("/users");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

module.exports.delete_user_post = async (req, res) => {
  try {
    const userid = req.params.id;
    const user = await User.findByIdAndDelete(userid);

    res.redirect("/users");
  } catch (err) {
    console.log(err);
  }
};

module.exports.borrow_post = async (req, res) => {
  const borrowdate = new Date();
  const dueDate = new Date(borrowdate);
  dueDate.setDate(dueDate.getDate() + 14);
  try {
    const book = req.params.id;
    const bookbyid = await Books.findById(book);
    const user = req.user._id;

    if (!bookbyid) {
      return res.status(404).send("Book not found");
    } else {
      if (bookbyid.quantity === 0) {
        return res.status(404).send("Book Out of Stock");
      } else {
        const borrow = await Borrow.create({ user, book, borrowdate, dueDate });
        bookbyid.quantity = bookbyid.quantity - 1;
        await bookbyid.save();
        res.redirect("/");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(404).send("something went wrong");
  }
};

module.exports.return_post = async (req, res) => {
  try {
    const borrowid = req.params.id;

    const borrow = await Borrow.findById(borrowid);

    if (!borrow) {
      return res.status(404).send("Borrow record not found");
    }

    // safety check
    if (borrow.status === "returned") {
      return res.status(400).send("Book already returned");
    }

    const book = await Books.findById(borrow.book);

    if (!book) {
      return res.status(404).send("Book not found");
    }

    borrow.status = "returned";

    book.quantity++;

    await book.save();
    await borrow.save();

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};
