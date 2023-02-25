require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const { Client, GatewayIntentBits } = require("discord.js");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function gptRes(prompt) {
  const openai = new OpenAIApi(configuration);
  const res = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 100,
    temperature: 0.9,
  });

  return res.data.choices[0].text;
}

client.on("ready", () => {
  console.log(`Ready in ${client.user.tag}!`);

  client.user.setActivity({
    name: '.gpt <msg>',
  })
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith(".gpt")) {
    const prompt = message.content;
    const res = await gptRes(prompt);
    message.reply(res);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
