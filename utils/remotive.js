const axios = require("axios");

/**
 * Fetch job listings from Remotive API based on provided search parameters.
 * @param {string[]} skills - Array of skills to search for in job listings.
 * @param {string} [category] - Optional category to filter job listings.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of job listings.
 * @throws {Error} - Throws an error if the API request fails or returns no jobs.
 */
const fetchJobListings = async (skills, category) => {
  try {
    // Ensure the skills parameter is a valid array
    if (!Array.isArray(skills) || skills.length === 0) {
      throw new Error("Skills must be a non-empty array.");
    }

    console.log("Fetching job listings for skills:", skills);

    // Construct the search query by joining skills with spaces (AND logic)
    const searchQuery = skills.join(" ");

    // Define the API endpoint and parameters
    const apiUrl = "https://remotive.com/api/remote-jobs";
    const params = {
      search: skills[1],
      category: category || "", // Use the provided category or an empty string
    };

    console.log("API request parameters:", params);

    // Make the GET request to the Remotive API
    const response = await axios.get(apiUrl, { params });

    // Check if the response contains job listings
    if (response.data && response.data.jobs && response.data.jobs.length > 0) {
      console.log(`Found ${response.data.jobs.length} job(s).`);
      return response.data.jobs;
    } else {
      console.error("No jobs found in the response.");
      throw new Error("No jobs found");
    }
  } catch (error) {
    console.error("Error in fetchJobListings:", error.message);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

module.exports = fetchJobListings;
