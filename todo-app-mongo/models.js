const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://deepaktomss_db_user:4nz8XSzcUEIoUMJ1@cluster0.4igvjh7.mongodb.net/todo");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

const TodoSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: mongoose.Types.ObjectId
});

const userModel = mongoose.model("users", UserSchema);
const todoModel = mongoose.model("todos", TodoSchema);

module.exports = {
    userModel: userModel,
    todoModel: todoModel
}