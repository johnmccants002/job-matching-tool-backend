const axios = require("axios");
const { summarize } = require("./openai");
const { GoogleSearch } = require("google-search-results-nodejs");

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

const fetchJobListings = async (skills) => {
  try {
    // Ensure the skills parameter is a valid array
    if (!Array.isArray(skills) || skills.length === 0) {
      throw new Error("Skills must be a non-empty array.");
    }

    console.log("Fetching job listings for skills:", skills);

    const search = new GoogleSearch(process.env.SERPAPI_API_KEY);

    // Set a valid location
    const location = "United States"; // Adjust as needed for your use case

    const params = {
      engine: "google_jobs",
      q: skills.join(" OR "), // Match any of the extracted skills
      location: location, // Use a supported location
    };

    console.log("Search parameters:", params);

    // Return a promise to fetch the job listings
    return new Promise((resolve, reject) => {
      search.json(params, (data) => {
        console.log("SerpAPI Response:", JSON.stringify(Object.keys(data)));

        if (data.jobs_results) {
          resolve(data.jobs_results);
        } else {
          console.error("No jobs found in the response.");
          reject("No jobs found");
        }
      });
    });
  } catch (error) {
    console.error("Error in fetchJobListings:", error.message);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

module.exports = { fetchCompanyInfo, summarizeText, fetchJobListings };
