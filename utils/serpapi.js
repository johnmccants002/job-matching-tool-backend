const axios = require("axios");
const { summarize } = require("./openai");

// Fetch company info from SerpAPI
async function fetchCompanyInfo(companyName) {
  const apiKey = process.env.SERPAPI_KEY;
  const response = await axios.get("https://serpapi.com/search", {
    params: {
      q: companyName,
      api_key: apiKey,
    },
  });

  return response.data.snippets[0]?.snippet || "No company information found.";
}

// Summarize text using OpenAI
async function summarizeText(text) {
  return await summarize(text);
}

module.exports = { fetchCompanyInfo, summarizeText };
