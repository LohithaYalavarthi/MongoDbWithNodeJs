const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./db");

const app = express();
//ideally databse request need to happen before even request happen
app.use(express.json()); // to get body object
//dbConnection
let db;
connectToDb((err) => {
  if (!err) {
    //if no error start listening requests
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});

app.listen(3000);
app.get("/", (req, res) => {
  res.render("/index");
});
app.get("/books", (req, res) => {
  const page = req.query.p;
  // or operator cant be able to enter so const page = req.query.p or  zero
  const booksPerPage = 3; // this is max pags you need per page
  //page = 0 , 1

  let books = [];
  // db.collection('books').find() return cursor which is an object points an document outlined with our query
  db.collection("books")
    .find()
    .sort({ author: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage) //pagination
    .forEach((book) => books.push(book)) //async method so we have to use the .then()
    .then(() => {
      res.status(200).json(books);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
  //toArray, forEach can be used with cursor
});
app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    // db.collection('books').find() return cursor which is an object points an document outlined with our query
    db.collection("books")
      .findOne({ _id: ObjectId(req.params.id) })
      .then(() => {
        res.status(200).json(books);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not fetch the documents" });
      });
    //toArray, forEach can be used with cursor
  } else {
    res.status(500).json({ error: "Not valid document id" });
  }
});
app.post("/books", (req, res) => {
  const book = req.body;
  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "could not create a new document" });
    });
});

app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    // db.collection('books').find() return cursor which is an object points an document outlined with our query
    db.collection("books")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then(() => {
        res.status(200).json(books);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not delete the documents" });
      });
    //toArray, forEach can be used with cursor
  } else {
    res.status(500).json({ error: "Not valid document id" });
  }
});
//Indexes
db.collection("books").find({ rating: 8 }).explain("executionStats");
// it will search entire documents of books in collection for doc with rating 10
//we might hav 1000 documents to scan and it would be inefficient

//running this in the Mongodb shell

db.books.createIndex({ rating: 8 });

db.books.getIndexes(); // gets Indexes

db.books.find({ rating: 8 }).explain("excutionStats");
db.books.dropIndex({ rating: 8 });
//Mongodb server online - use mongodb atlas - mongodb/atlas
