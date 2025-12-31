import "dotenv/config";

const getHuggingFaceResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.HF_API_KEY}`,
    },
    body: JSON.stringify({
      model: "meta-llama/Llama-3.1-8B-Instruct:cerebras",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 200,
    }),
  };

  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      options
    );

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error(err);
  }
};

export default getHuggingFaceResponse;
