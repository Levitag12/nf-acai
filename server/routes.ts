import { Router } from "express";

const routes = Router();

// Health check ou rota base
routes.get("/", (req, res) => {
  res.status(200).json({ message: "✅ API funcionando corretamente!" });
});

export default routes;
