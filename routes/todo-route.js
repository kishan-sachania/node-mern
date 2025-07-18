const express = require("express");
const router = express.Router();
const {
  get_all_todo,
  get_one_todo,
  add_todo,
  update_todo,
  delete_todo,
} = require("../controllers/TodoController/todoController");

//get all todo
router.get("/", get_all_todo);

//get todo by id
router.get("/:id", get_one_todo);

//add todo
router.post("/add", add_todo);

//update todo
router.patch("/:id", update_todo);

//delete todo
router.delete("/:id", delete_todo);

module.exports = router;
