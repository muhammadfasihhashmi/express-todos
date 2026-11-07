import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "../controllers/todo.controller.js";

const router = express.Router();

router.get("/", getTodos);

router.get("/:id", getTodoById);

router.post("/", createTodo);

router.delete("/:id", deleteTodo);

router.patch("/:id", updateTodo);

export default router;
