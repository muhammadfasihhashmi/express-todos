import { prisma } from "../config/db.js";
import { isValidId } from "../utils/helpers.js";

export async function getTodos(req, res) {
  console.log(req.user);
  const todos = await prisma.todo.findMany();
  res.json(todos);
}

export async function getTodoById(req, res) {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    return res.status(404).json({ error: "todo not found" });
  }
  res.json(todo);
}

export async function createTodo(req, res) {
  const { title } = req.body ?? {};
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "A valid title is required",
    });
  }
  const todo = await prisma.todo.create({
    data: {
      title,
    },
  });
  res.status(201).json({ message: "Todo added successfully", todo });
}

export async function deleteTodo(req, res) {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  await prisma.todo.delete({ where: { id } });

  res.status(200).json({ message: "Todo deleted successfully" });
}

export async function updateTodo(req, res) {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const { title, completed } = req.body ?? {};

  if (title === undefined && completed === undefined) {
    return res.status(400).json({
      error: "At least one field is required to update",
    });
  }

  const todo = await prisma.todo.findUnique({ where: { id } });

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: {
      title,
      completed,
    },
  });

  res.json({ message: "Todo updated Successfully", todo: updatedTodo });
}
