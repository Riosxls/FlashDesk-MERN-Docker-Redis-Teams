const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createClient } = require("redis");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const Ticket = require("./models/Ticket");

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/flashdesk_db";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Conectado"))
  .catch((err) => console.error(err));

const redisClient = createClient({ url: "redis://redis:6379" });
redisClient.on("error", (err) => console.log("Erro no Redis", err));
(async () => {
  await redisClient.connect();
  console.log("✅ Redis Publisher Conectado");
})();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: { title: "FlashDesk API", version: "1.0.0" },
  servers: [{ url: "http://localhost:3001" }],
};
const swaggerOptions = { definition: swaggerDefinition, apis: [] };
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/tickets", async (req, res) => {
  const { title, description, contactEmail } = req.body;
  const newTicket = new Ticket({ title, description, contactEmail });
  try {
    const savedTicket = await newTicket.save();

    await redisClient.publish(
      "ticket_events",
      JSON.stringify({
        id: savedTicket._id,
        title: savedTicket.title,
        description: savedTicket.description,
        status: "Aberto",
        eventType: "CRIAR",
      })
    );

    res.status(201).json(savedTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/tickets/:id", async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);

    if (deletedTicket) {
      await redisClient.publish(
        "ticket_events",
        JSON.stringify({
          id: deletedTicket._id,
          title: deletedTicket.title,
          description: deletedTicket.description,
          status: "Cancelado",
          eventType: "DELETAR",
        })
      );
    }

    res.json({ message: "Chamado deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/tickets/:id", async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await redisClient.publish(
      "ticket_events",
      JSON.stringify({
        id: updatedTicket._id,
        title: updatedTicket.title,
        description: updatedTicket.description,
        status: "Atualizado",
        eventType: "ATUALIZAR",
      })
    );

    res.json(updatedTicket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🚀 FlashDesk Ticket Service rodando na porta ${PORT}`)
);
