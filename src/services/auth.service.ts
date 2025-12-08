import express from "express";
import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const rounds = process.env.BCRYPT_ROUNDS;
// Middleware JSON body parsinimui
app.use(express.json());

export async function createUser(email: string, password: string, userName: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email: email,
    passwordHash: hashedPassword,
    name: userName,
  });
  return newUser;
}
