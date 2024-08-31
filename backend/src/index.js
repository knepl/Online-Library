const request = require("request");
require("dotenv").config();
const config = require("./config.json");

const mongoose = require("mongoose");
mongoose.connect(config.connectionString);

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("Mongo DB Connection Successfull");
});

connection.on("error", (err) => {
  console.log("Mongo DB Connection Failed");
});

const User = require("../models/userModel");
const Book = require("../models/bookModel");
const ReadBooksList = require("../models/readBooksListModel");
const ReadingList = require("../models/readingListModel");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

//Create account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exist",
    });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: {
      fullName: isUser.fullName,
      emal: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
});

//Add books to reading list
app.post("/add-books-to-reading-list", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });

  const reqBook = req.body;

  if (!isUser) {
    return res.sendStatus(401);
  }
  let bookId;
  const isBook = await Book.findOne({
    title: reqBook.title,
    description: reqBook.description,
    imgSrc: reqBook.imgSrc,
  });
  if (!isBook) {
    const book = new Book({
      title: reqBook.title,
      author: reqBook.author,
      description: reqBook.description,
      imgSrc: reqBook.imgSrc,
    });

    book.save();

    const addedBook = await Book.findOne({
      title: reqBook.title,
      description: reqBook.description,
      imgSrc: reqBook.imgSrc,
    });

    console.log(addedBook);
    if (!addedBook) {
      return res.sendStatus(401);
    }

    bookId = addedBook._id;
  } else {
    bookId = isBook._id;
  }

  const isReadList = await ReadingList.findOne({
    userId: isUser._id,
    bookId: bookId,
  });
  if (!isReadList) {
    const readList = new ReadingList({
      userId: isUser._id,
      bookId: bookId,
    });

    readList.save();
  }
  return res.json({
    book: {
      title: reqBook.title,
      reqBook: reqBook.author,
      description: reqBook.description,
      imgSrc: reqBook.imgSrc,
    },
    readList: {
      userId: isUser._id,
      bookId: bookId,
    },
    message: "All books retrieved successfully",
  });
});

app.post("/read-book", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });

  const reqBook = req.body;

  if (!isUser) {
    return res.sendStatus(401);
  }
  let bookId;
  const isBook = await Book.findOne({
    title: reqBook.title,
    description: reqBook.description,
    imgSrc: reqBook.imgSrc,
  });
  if (!isBook) {
    const book = new Book({
      title: reqBook.title,
      author: reqBook.author,
      description: reqBook.description,
      imgSrc: reqBook.imgSrc,
    });

    book.save();

    const addedBook = await Book.findOne({
      title: reqBook.title,
      description: reqBook.description,
      imgSrc: reqBook.imgSrc,
    });

    if (!addedBook) {
      return res.sendStatus(401);
    }

    bookId = addedBook._id;
  } else {
    bookId = isBook._id;
  }

  const isReadbook = await ReadBooksList.findOne({
    userId: isUser._id,
    bookId: bookId,
  });
  if (!isReadbook) {
    const readBook = new ReadBooksList({
      userId: isUser._id,
      bookId: bookId,
    });

    readBook.save();
  }
  return res.json({
    book: {
      title: reqBook.title,
      reqBook: reqBook.author,
      description: reqBook.description,
      imgSrc: reqBook.imgSrc,
    },
    readList: {
      userId: isUser._id,
      bookId: bookId,
    },
    message: "All books retrieved successfully",
  });
});

app.post("/move-to-already-read-books", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });
  if (!isUser) {
    return res.sendStatus(401);
  }

  const isReadingList = await ReadingList.findOne({ bookId: req.body.bookId });

  if (!isReadingList) {
    return res.status(404).json({ error: true, message: "Book not found" });
  }

  const isReadBook = await ReadBooksList.findOne({
    userId: isUser._id,
    bookId: req.body.bookId,
  });

  if (!isReadBook) {
    const readBook = new ReadBooksList({
      userId: isUser._id,
      bookId: req.body.bookId,
    });

    readBook.save();
    isReadingList.deleteOne({
      bookId: req.body.bookId,
      userId: isUser._id,
    });
    return res.json({
      error: false,
      bookId: req.body.bookId,
      message:
        "Book has been successfully move to the list of already read books",
    });
  }

  return res.json({
    error: false,
    bookId: req.body.bookId,
    message: "The book was already in the other list, no action taken",
  });
});

// Move book to reading list
app.post("/move-to-reading-list", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });
  if (!isUser) {
    return res.sendStatus(401);
  }

  const isReadBook = await ReadBooksList.findOne({ bookId: req.body.bookId });
  if (!isReadBook) {
    return res.status(404).json({ error: true, message: "Book not found" });
  }

  const isReadingList = await ReadingList.findOne({
    userId: isUser._id,
    bookId: req.body.bookId,
  });
  if (!isReadingList) {
    const readingList = new ReadingList({
      userId: isUser._id,
      bookId: req.body.bookId,
    });

    readingList.save();
    isReadBook.deleteOne({
      _id: isReadBook._id,
    });
  }
  return res.json({
    error: false,
    bookId: req.body.bookId,
    message: "Book updated successfully",
  });
});

//Get All Books
app.get("/get-all-books-lists/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const readBooks = await ReadBooksList.find({ userId: user._id });
  const readingList = await ReadingList.find({ userId: user._id });
  const readBooksList = [];
  const readingBooksList = [];

  for (const readBook of readBooks) {
    const book = await Book.findOne({ _id: readBook.bookId });
    readBooksList.push(book);
  }

  for (const readingBook of readingList) {
    const book = await Book.findOne({ _id: readingBook.bookId });
    readingBooksList.push(book);
  }

  try {
    return res.json({
      error: false,
      readBooksList,
      readingBooksList,
      message: "All Lists are retrieved",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

app.listen(8000);

module.exports = app;
