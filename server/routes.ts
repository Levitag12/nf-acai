import { Router } from "express";

const routes = Router();

routes.get("/", (req, res) => {
  res.send("API funcionando!");
});

export default routes;
