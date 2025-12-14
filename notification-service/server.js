const express = require("express");
const { createClient } = require("redis");
const axios = require("axios");

const app = express();
const PORT = 3002;

const TEAMS_WEBHOOK_URL =
  "https://default11dbbfe289b84549be10cec364e595.51.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/450c2e8e0c8c47dd86d90fecb6c37144/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=oJKLLwI_STcarZUWqeS6KS5kVIhTHPawpZ-WeatLV00";

const redisClient = createClient({ url: "redis://redis:6379" });
redisClient.on("error", (err) => console.log("Erro no Redis", err));

(async () => {
  await redisClient.connect();
  console.log("✅ Redis Subscriber Conectado");

  await redisClient.subscribe("ticket_events", async (message) => {
    const ticket = JSON.parse(message);
    console.log(`📩 Evento recebido: ${ticket.eventType} - ${ticket.title}`);

    let cardTitle = "🚀 Novo Chamado FlashDesk";
    let cardColor = "Accent";
    let statusText = ticket.status || "Aberto";

    if (ticket.status === "Cancelado") {
      cardTitle = "❌ Chamado Cancelado";
      cardColor = "Attention";
    } else if (ticket.status === "Atualizado") {
      cardTitle = "📝 Chamado Atualizado";
      cardColor = "Warning";
    }

    const adaptiveCardPayload = {
      type: "message",
      attachments: [
        {
          contentType: "application/vnd.microsoft.card.adaptive",
          contentUrl: null,
          content: {
            $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
            type: "AdaptiveCard",
            version: "1.4",
            body: [
              {
                type: "TextBlock",
                text: cardTitle,
                weight: "Bolder",
                size: "Medium",
                color: cardColor,
              },
              {
                type: "TextBlock",
                text: ticket.description,
                wrap: true,
                spacing: "Small",
              },
              {
                type: "FactSet",
                facts: [
                  { title: "Título:", value: ticket.title },
                  { title: "Status:", value: statusText },
                  { title: "ID:", value: ticket.id },
                ],
              },
            ],
          },
        },
      ],
    };

    try {
      await axios.post(TEAMS_WEBHOOK_URL, adaptiveCardPayload);
      console.log(`✅ Notificação enviada: ${ticket.status}`);
    } catch (error) {
      console.error("❌ Erro ao enviar para o Teams:", error.message);
    }
  });
})();

app.listen(PORT, () =>
  console.log(`🔔 FlashDesk Notification Service rodando na porta ${PORT}`)
);
