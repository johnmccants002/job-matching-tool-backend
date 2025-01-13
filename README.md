# Job Matching Tool Documentation

## Overview

The **Job Matching Tool** is a web application designed to simplify the job search process by offering advanced features such as:

- **Job Matching:** Finds remote job listings that align with users' skills and resumes.
- **Company Research:** Provides concise summaries of company operations and products.
- **Contact Discovery:** Identifies founders and hiring managers with LinkedIn profiles.

This project leverages:

- **LinkedIn OAuth 2.0 Authentication** for secure login.
- APIs like **LinkedIn**, **SerpAPI**, and **OpenAI** for enhanced job matching and research.

---

## Features

### 1. **Login with LinkedIn**

- Enables users to securely log in using their LinkedIn account.

### 2. **Job Matching**

- Matches remote jobs based on the user's LinkedIn profile and resume.

### 3. **Company Research**

- Retrieves and displays two-sentence summaries about companies.

### 4. **Contact Discovery**

- Identifies key personnel (e.g., founders, hiring managers) and their LinkedIn profiles.

---

## Installation

### **Prerequisites**

Ensure the following are installed:

- [Node.js](https://nodejs.org) (v14 or above)
- [npm](https://npmjs.com) or [yarn](https://yarnpkg.com)
- A LinkedIn Developer Account with API access.

### **Clone the Repository**

```bash
git clone https://github.com/yourusername/job-matching-tool-backend.git
cd job-matching-tool-backend
```

### **Backend Setup**

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```plaintext
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   LINKEDIN_REDIRECT_URI=http://localhost:3001/auth/linkedin/callback
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

---

## Usage

1. Open your browser and navigate to `http://localhost:3001`.
2. Use API endpoints for job matching, company research, and contact discovery.

---

## Project Structure

```plaintext
job-matching-tool-backend/
├── backend/           # Backend API with Express
│   ├── routes/        # API endpoints (LinkedIn, job matching, etc.)
│   ├── utils/         # Helper functions (LinkedIn API, SerpAPI, etc.)
│   └── index.js       # Entry point for the server
└── README.md          # Project documentation
```

---

## Known Issues

- **Rate Limits:** LinkedIn's API often returns `429 Too Many Requests`. Implementing rate-limiting or caching can help mitigate this issue.
- **Limited API Access:** Permissions for accessing specific LinkedIn data may require additional approval.

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or suggestions, please contact:

**John McCants**  
[LinkedIn](https://www.linkedin.com/in/johnmccants/)
