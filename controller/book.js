import Book from "../models/book.model.js";

const bookController = {
  addBook: async (req, res) => {
    const { url, title, author } = req.body;
    if (!url || !title || !author) {
      return res.status(400).send({
        msg: "All fields are required",
      });
    }
    try {
      const checkIsAval = await Book.findOne({ title: title });
      if (checkIsAval) {
        return res.status(200).send({ msg: "Books   already exists" });
      }
      const newBook = new Book({
        url,
        title,
        author,
      });
      await newBook.save();
      res.send({ msg: "Book added successfully" });
    } catch (error) {
      res.status(403).send({ err: error.message });
    }
  },
  getBookById: async (req, res) => {
    const { bookId } = req.params;
    try {
      const singleBook = await Book.findById({ _id: bookId });
      if (!singleBook) {
        return res.status(404).send({ msg: "Please enter a valid Id" });
      }
      res.status(200).json(singleBook);
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  },
  getAllBooks: async (req, res) => {
    try {
      const allBooks = await Book.find();
      if (!allBooks) {
        return res.status(200).send({ msg: "Empty" });
      }
      return res.status(200).json(allBooks);
    } catch (error) {
      res.status(400).send({ err: error.message });
    }
  },
  updateBook: async (req, res) => {
    try {
      const bookId = req.params.bookId;
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).send({ msg: "Book not found" });
      }

      await Book.findByIdAndUpdate(bookId, { $set: req.body });
      res.send("Data updated successfully");
    } catch (error) {
      res.status(404).send({ Error: error.message });
    }
  },
  deleteBook: async (req, res) => {
    try {
      let { bookId } = req.params;
      let book = await Book.findById({ _id: bookId });
      if (!book) {
        return res.status(404).send({ msg: "Book not found" });
      }

      await Book.findByIdAndDelete({ _id: bookId });
      res.status(200).send({ msg: "Book deleted successfully" });
    } catch (error) {
      res.send({ err: error.message });
    }
  },
};

export default bookController;
