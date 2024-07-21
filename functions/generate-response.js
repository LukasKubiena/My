const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { userInput, messages } = JSON.parse(event.body);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": "You are an AI that represents Lukas Kubiena neutrally in a nice and calm tone..."
        },
        ...messages,
        { "role": "user", "content": userInput }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ response: response.data.choices[0].message.content.trim() })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate response" })
    };
  }
};