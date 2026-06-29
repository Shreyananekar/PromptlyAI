import "dotenv/config";

const getHuggingFaceResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
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

    console.log("HF RESPONSE:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.error || JSON.stringify(data));
    }

    return data.choices?.[0]?.message?.content;
  } catch (err) {
    console.error("HF ERROR:", err);
    throw err;
  }
};

export default getHuggingFaceResponse;
