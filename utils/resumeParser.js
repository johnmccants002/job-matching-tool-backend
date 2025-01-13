const fs = require("fs");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");
const { z } = require("zod");

const parseResume = async (filePath) => {
  // Define the schema to validate the structure of the extracted data
  const resumeSchema = z.object({
    skills: z.array(z.string()).optional(), // Array of strings for languages and frameworks
    job_titles: z.array(z.string()).optional(), // Array of job titles
    industries: z.array(z.string()).optional(), // Array of industries
  });

  try {
    console.log("Starting resume parsing...");

    // Read and parse the PDF file
    const fileBuffer = fs.readFileSync(filePath);
    const parsedData = await pdfParse(fileBuffer);
    const resumeText = parsedData.text;

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call OpenAI to extract key data from the resume
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that extracts key information from resumes. Return the skills (languages and frameworks only), job titles, and industries as JSON.",
        },
        {
          role: "user",
          content: `Extract the following key data as JSON: 
          - skills: Include only languages and frameworks
          - job_titles: A list of job titles from the resume
          - industries: Relevant industries
          
          Resume content:\n\n${resumeText}
          
          Follow this schema and return the data in this format:   const resumeSchema = z.object({
    skills: z.array(z.string()).optional(), // Array of strings for languages and frameworks
    job_titles: z.array(z.string()).optional(), // Array of job titles
    industries: z.array(z.string()).optional(), // Array of industries
  });
          `,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    var rawResponse = response.choices[0]?.message?.content;
    rawResponse = rawResponse.replace(/```json|```/g, "").trim();

    console.log("Raw OpenAI response:", rawResponse); // Debug raw response

    // Attempt to parse the response into JSON
    const extractedData = JSON.parse(rawResponse);

    // Validate the response structure against the schema
    const validatedData = resumeSchema.parse(extractedData);
    console.log("Validated extracted data:", validatedData); // Log validated data

    return validatedData;
  } catch (error) {
    console.error("Error parsing resume:", error.message);
    console.error("Stack trace:", error.stack);
    throw error; // Re-throw error for further handling
  }
};

module.exports = parseResume;
