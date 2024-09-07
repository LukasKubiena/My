import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { userInput, messages } = JSON.parse(event.body);

    console.log('Sending request to OpenAI...');
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Changed from "gpt-4o-mini"
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages,
        { role: "user", content: userInput }
      ],
    });
    console.log('Received response from OpenAI');

    return {
      statusCode: 200,
      body: JSON.stringify({ response: response.choices[0].message.content }),
    };
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "An error occurred while processing your request.",
        details: error.response?.data || error.message,
        stack: error.stack
      }),
    };
  }
};