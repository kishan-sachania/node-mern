const TodoModel = require("../../models/todo/todoSchema");
  
//get all
const get_all_todo = (req, res) => {
  TodoModel.find()
    .then((result) => {
      // console.log(result);
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
};

// get by id
const get_one_todo = (req, res) => {
  TodoModel.findById(req.params.id)
    .then((result) => {
      // console.log(result);
        res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
};

// add
const add_todo = (req, res) => {
  const todo = new TodoModel(req.body);
  todo
    .save()
    .then((result) => {
      // console.log(result);
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
};

// update
const update_todo = (req, res) => {
  TodoModel.updateOne({ _id: req.body._id }, { $set: { ...req.body } })
    .then((result) => {
      // console.log(result);
        res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
};

// delete
const delete_todo = (req, res) => {
  TodoModel.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ message: "Todo deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = {
  get_all_todo,
  get_one_todo,
  add_todo,
  update_todo,
  delete_todo,
};
