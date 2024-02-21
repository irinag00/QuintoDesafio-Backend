import { Router } from "express";
import { ChatManagerDB } from "../dao/controllersDB/ChatManagerDB.js";

const chatRouter = Router();
const chatManager = new ChatManagerDB();

chatRouter.get("/chat", async (req, res) => {
  res.render("chat.handlebars");
});

chatRouter.post("/chat", async (req, res) => {
  const { user, message } = req.body;
  if (!user || !message) {
    throw new Error("User and message are required");
  }
  try {
    const result = await chatManager.addChat(user, message);
    res.json({ result: "success", payload: result });
  } catch (error) {
    console.error("Error al guardar el mensaje en la base de datos:", error);
    throw error;
  }
});

export default chatRouter;
