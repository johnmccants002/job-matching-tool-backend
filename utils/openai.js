const OpenAI = require("openai");
const SerpApi = require("google-search-results-nodejs");

// Initialize OpenAI and SerpApi
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const serpApiClient = new SerpApi.GoogleSearch(process.env.SERPAPI_API_KEY);

async function searchWithSerpApi(query) {
  return new Promise((resolve, reject) => {
    serpApiClient.json(
      {
        q: query,
        location: "United States",
        hl: "en",
        gl: "us",
      },
      (data) => {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.organic_results || []);
        }
      }
    );
  });
}

async function getHiringManagerInfo(companyName) {
  try {
    // Use SerpApi to search for hiring managers or talent acquisition contacts
    const query = `${companyName} hiring manager OR talent acquisition`;
    const searchResults = await searchWithSerpApi(query);

    if (searchResults.length === 0) {
      return `No relevant results found for company: ${companyName}`;
    }

    // Format the search results for OpenAI
    const formattedResults = searchResults.map((result) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet,
    }));

    // Use OpenAI to interpret the results
    const messages = [
      {
        role: "system",
        content:
          "You are an AI assistant that helps summarize search results to identify hiring managers or talent acquisition contacts for companies.",
      },
      {
        role: "user",
        content: `Here are some search results: ${JSON.stringify(
          formattedResults
        )}. Can you identify the hiring manager or talent acquisition contact for ${companyName}?
        
        Please return a JSON object with the following fields:
        - name: The name of the hiring manager or talent acquisition contact
        - title: The title of the hiring manager or talent acquisition contact
        - linkedin_url: The LinkedIn URL of the hiring manager or talent acquisition contact
        - company_name: The name of the company the hiring manager or talent acquisition contact works for
        `,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
    });

    // Return OpenAI's summary
    return JSON.parse(completion.choices[0].message.content.trim());
  } catch (error) {
    console.error("Error fetching hiring manager info:", error.message);
    return "An error occurred while retrieving information.";
  }
}

module.exports = { getHiringManagerInfo };
