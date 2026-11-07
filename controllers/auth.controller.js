import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function registerUser(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Req body is needed" });
  }
  const { name, email, password } = req.body;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return res.status(400).json({
      error: "Name, email and password are required",
    });
  }
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    return res.status(409).json({
      error: "email is allready registered.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
    },
  });

  const { password: _, ...user } = newUser;

  return res.status(201).json({
    message: "user regestered successfully",
    user,
  });
}

export async function loginUser(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Req body is needed" });
  }
  const { email, password: reqPassword } = req.body;
  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof reqPassword !== "string" ||
    !reqPassword
  ) {
    return res.status(400).json({
      error: "email and password are required",
    });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!existingUser) {
    return res.status(401).json({
      error: "Unauthorized, no user found",
    });
  }
  const { password: hashedPassword, ...user } = existingUser;
  const isValidPassword = await bcrypt.compare(reqPassword, hashedPassword);
  if (!isValidPassword) {
    return res.status(401).json({ error: "invalid password" });
  }

  const payLoad = {
    name: user.name,
    email: user.email,
    id: user.id,
  };
  const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
    expiresIn: "1d",
    algorithm: "HS256",
  });

  return res.status(200).json({
    message: "login successfully",
    token,
    user,
  });
}
