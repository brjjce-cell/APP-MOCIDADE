import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Google Gen AI Client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// AI Endpoint: Generate Social Posts and Devotionals from Study
app.post("/api/ai/study-posts", async (req, res) => {
  try {
    const { title, passage, outline, application } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Título do estudo é obrigatório." });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return high-quality structured fallback if key is missing
      return res.json({
        socialPost: `🔥 *ESTUDO DA SEMANA: ${title.toUpperCase()}* 📖\n\nTexto bíblico: ${passage || "Bíblia Sagrada"}\n\nNeste sábado mergulhamos fundo no tema "${title}". Aprendemos que nossa fé precisa se traduzir em atitudes diárias no colégio, na faculdade e no trabalho!\n\n💡 *Ponto chave:* ${application || "Viver com propósito e compromisso com o Reino."}\n\n💬 Você esteve conosco? Conta aqui nos comentários o que mais te marcou!\n\n#MinistérioDeJovens #JuventudeCristã #${title.replace(/\s+/g, "")}`,
        devotionalMessage: `Graça e paz, galera! ☀️\n\nPassando para lembrar do nosso estudo sobre *"${title}"* (${passage || ""}).\n\nNesta terça-feira, tire 5 minutos para orar e refletir: como você pode aplicar a mensagem de sábado no seu dia de hoje?\n\nQue a presença de Deus acompanhe a sua semana! Tamo junto! 🙏`,
        discussionQuestions: [
          `Qual é o maior desafio que você enfrenta hoje em relação a "${title}"?`,
          `Como o texto de ${passage || "sábado"} conversa diretamente com a nossa rotina jovem?`,
          `Qual compromisso prático você pode assumir com Deus até o próximo sábado?`
        ]
      });
    }

    const ai = getGenAI();
    const prompt = `Você é um líder experiente de ministério de jovens cristão.
A partir do estudo bíblico a seguir, gere:
1. Um post engajador para o Instagram (com emojis, chamada para ação, hashtags).
2. Uma mensagem devocional curta para enviar no grupo de WhatsApp na terça-feira seguinte (reforço de conteúdo).
3. 3 perguntas reflexivas para grupos pequenos / células.

Dados do estudo:
- Título: ${title}
- Passagem bíblica: ${passage || "Não especificado"}
- Resumo / Tópicos: ${outline || "Geral"}
- Aplicação prática: ${application || "Geral"}

Responda em formato JSON com a seguinte estrutura:
{
  "socialPost": "texto do post para Instagram",
  "devotionalMessage": "texto do devocional de terça para WhatsApp",
  "discussionQuestions": ["pergunta 1", "pergunta 2", "pergunta 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            socialPost: { type: Type.STRING },
            devotionalMessage: { type: Type.STRING },
            discussionQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["socialPost", "devotionalMessage", "discussionQuestions"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Erro no endpoint /api/ai/study-posts:", error);
    return res.status(500).json({
      error: "Falha ao gerar resumo do estudo.",
      details: error?.message || String(error),
    });
  }
});

// AI Endpoint: Creative ideas for evangelism & gifts
app.post("/api/ai/creative-ideas", async (req, res) => {
  try {
    const { category, budget, context } = req.body; // category: 'evangelism' | 'gifts'

    if (!process.env.GEMINI_API_KEY) {
      if (category === "gifts") {
        return res.json({
          ideas: [
            {
              title: "Pulseiras de Silicone com Versículo Marcante",
              description: "Pulseiras pretas ou azul marinho com gravação em baixo relevo do versículo tema do ano.",
              estimatedCost: "R$ 3,50 a R$ 5,00 un. (lote com 50)",
              howToExecute: "Fazer cotação com fabricantes de brindes ou compras online em atacado 30 dias antes.",
              type: "encomendado"
            },
            {
              title: "Kit Caderninho + Caneta Kraft Personalizada",
              description: "Caderninho estilo Moleskine com capa em papel kraft carimbada com logo do ministério + caneta ecológica.",
              estimatedCost: "R$ 6,00 a R$ 8,50 un.",
              howToExecute: "Comprar blocos kraft em papelaria atacadista e encomendar carimbo de madeira com logo.",
              type: "artesanal"
            },
            {
              title: "Garrafinhas Squeeze Alumínio/Inox",
              description: "Garrafas esportivas térmicas ou de alumínio fosco com gravação a laser ou serigrafia.",
              estimatedCost: "R$ 14,00 a R$ 19,00 un.",
              howToExecute: "Ideal como kit de boas-vindas de retiro anual ou premiação de gincana.",
              type: "encomendado"
            }
          ]
        });
      } else {
        return res.json({
          ideas: [
            {
              title: "Café com Oração na Praça / Ponto de Ônibus",
              description: "Montar mesa simples com café quente, bolo e uma placa: 'Posso orar por você hoje? Café grátis e uma oração'.",
              estimatedCost: "R$ 40 a R$ 70 total",
              howToExecute: "Equipe de 6 jovens em sábado de manhã em praça movimentada ou perto de terminal.",
              context: "Rua"
            },
            {
              title: "Cartões de Gentileza Secreta nas Faculdades",
              description: "Cartões com frases bíblicas de acolhimento e bombom deixados em carteiras antes das provas.",
              estimatedCost: "R$ 50 total (bombons + impressão)",
              howToExecute: "Jovens universitários distribuem estrategicamente durante a semana de provas.",
              context: "Ambiente Estudantil"
            },
            {
              title: "Noite de Louvor Acústico na Calçada ou Parque",
              description: "Violão, cajón e vozes cantando hinos conhecidos com entrega de folhetos convidativos com QR Code do WhatsApp.",
              estimatedCost: "Custo quase zero",
              howToExecute: "Reunir grupo de louvor com esteira ou caixote em espaço público ao ar livre.",
              context: "Ar Livre"
            }
          ]
        });
      }
    }

    const ai = getGenAI();
    const isGifts = category === "gifts";
    const prompt = isGifts
      ? `Você é um diretor criativo de eventos para jovens evangélicos.
Gere 3 ideias inteligentes de brindes/lembrancinhas (misturando artesanais econômicos e encomendados).
Orçamento estimado: ${budget || "econômico a moderado"}.
Contexto/tema: ${context || "Retiro ou Encontro Especial"}.

Retorne em formato JSON:
{
  "ideas": [
    {
      "title": "Nome do brinde",
      "description": "Detalhes visuais e práticos",
      "estimatedCost": "Estimativa em R$ por unidade",
      "howToExecute": "Passo a passo rápido de produção ou compra",
      "type": "artesanal ou encomendado"
    }
  ]
}`
      : `Você é um especialista em evangelismo criativo e ação social jovem.
Gere 3 ideias práticas, cativantes e não invasivas para alcançar outros jovens.
Contexto: ${context || "Praça pública, faculdade ou redes sociais"}.
Orçamento: ${budget || "Baixo custo"}.

Retorne em formato JSON:
{
  "ideas": [
    {
      "title": "Nome da ação",
      "description": "Como a ação impacta as pessoas",
      "estimatedCost": "Custo aproximado total",
      "howToExecute": "Logística e divisão de papéis da equipe",
      "context": "Contexto principal da ação"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Erro no endpoint /api/ai/creative-ideas:", error);
    return res.status(500).json({ error: "Falha ao gerar ideias criativas." });
  }
});

// AI Endpoint: Personalized Birthday Message
app.post("/api/ai/birthday-msg", async (req, res) => {
  try {
    const { name, traits } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Nome é obrigatório." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        shortMsg: `Fala ${name}! Parabéns pelo seu dia, irmão(ã)! 🎉 Que Deus derrame bençãos sem medida sobre você neste novo ciclo. Estamos muito felizes por ter você junto com a gente no ministério! Tamo junto sempre! 🙏🎂`,
        groupMsg: `🎉 *HOJE É DIA DE FESTA!* 🎂\n\nNossa homenagem e carinho especial hoje vão para o querido(a) *${name}*! Que o Senhor guie cada passo, abra portas e renove seus sonhos!\n\nDeixem aqui seus parabéns para celebrar a vida dele(a)! 👏✨`,
        verse: "O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti e te conceda graça. — Números 6:24-25"
      });
    }

    const ai = getGenAI();
    const prompt = `Gere mensagens de aniversário cristãs e afetuosas para o jovem "${name}".
Características/observações: ${traits || "jovem querido do ministério"}.

Retorne em JSON:
{
  "shortMsg": "Mensagem carinhosa e descontraída para mandar no privado do WhatsApp",
  "groupMsg": "Mensagem festiva e vibrante para postar no grupo da mocidade",
  "verse": "Versículo bíblico de bênção com citação"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Erro no endpoint /api/ai/birthday-msg:", error);
    return res.status(500).json({ error: "Falha ao gerar mensagem de aniversário." });
  }
});

// Vite middleware in dev, static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
