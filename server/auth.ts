import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/login", (req, res) => {
  // Lógica de login
  res.send("Login route");
});

export default authRoutes;
