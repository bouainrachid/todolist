//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = new mongoose.Schema({
  name: "String",
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: ">>> Welcome to the Todolist!",
});

const item2 = new Item({
  name: ">>> Hits the + button to add a new item.",
});

const item3 = new Item({
  name: ">>> Hits this to delete an item.",
});

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
  Item.find({}, (e, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (e) => {
        if (e) {
          console.log(e);
        } else {
          console.log(">>> Successfully saved default items to DB!...");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems,
      });
    }
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName,
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const chechedItemId = req.body.checkbox;
  Item.findByIdAndRemove(chechedItemId, (e) => {
    if (!e) {
      console.log("Successfully deleted checked it");
      res.redirect("/");
    }
  });
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
