# Medical-Diagnostics-Chatbot

Built a chatbot capable of diagnosing common medical conditions based on user symptom inputs. The application utilizes machine learning and LLM-based models trained on medical data to provide relevant suggestions and recommendations for further action.

## Built By

**Arin Jain**  
(Feel free to contact in case of issues)

## NOTE

Kindly modify the `.env` file accordingly.

During signup, please ensure the following fields are filled correctly:

- Unique Email ID
- Password (minimum length: 6)
- Name
- Contact Number
- Emergency Contact Number


---

# MEDBOT-AI

MEDBOT-AI is a full-stack medical chatbot application that provides users with general health advice, symptom checking, mental health support, medication reminders, and nearby hospital search functionality. It includes a backend server for handling API requests and a frontend client for user interaction.

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Project Structure

The project is divided into two main parts:

1. **Backend** – Handles API requests, authentication, database interactions, and chatbot logic.
2. **Frontend** – A React-based user interface that allows users to interact with the chatbot.

## Prerequisites

Ensure the following are installed on your system:

- Node.js (v16.x or later)
- npm (v8.x or later)

## Installation

### 1. Clone the Repository

```sh
git clone https://github.com/arinjainn/Medical-Diagnostics-Chatbot
cd Medical-Diagnostics-Chatbot

2. Install Dependencies
Backend
sh
Copy code
cd backend
npm install

!!!below installations if facing any problem further-

npm install @google/generative-ai
npm install @langchain/google-genai
npm install axios
npm install bcrypt
npm install chalk
npm install concurrently
npm install cookie-parser
npm install cors
npm install dotenv
npm install express
npm install express-validator
npm install googleapis
npm install jsonwebtoken
npm install langchain
npm install mongoose
npm install morgan
npm install node-cron
npm install openai
npm install twilio


Frontend
sh
Copy code
cd ../frontend
npm install

!!!below installations if facing any problem further
npm install @emotion/react
npm install @emotion/styled
npm install @mui/icons-material
npm install @mui/material
npm install axios
npm install langchain
npm install react
npm install react-dom
npm install react-hot-toast
npm install react-icons
npm install react-markdown
npm install react-router-dom
npm install react-syntax-highlighter
npm install react-type-animation

Running the Application
1. Set Up Environment Variables
Create a .env file in both the backend and frontend directories with the necessary environment variables. See Environment Variables for details.

2. Start the Backend Server
sh
Copy code
cd backend
npm run dev

3. Start the Frontend Development Server
Open a new terminal and navigate to the frontend directory:
sh
Copy code
cd frontend
npm run dev
This will start the Vite development server, and you can access the frontend at http://localhost:3000.

makefile
## Environment Variables

Create a `.env` file in the root of your `backend` directory and add the following variables. Replace the placeholder values with your actual keys and credentials.

OPEN_AI_SECRET=your_open_ai_secret
OPENAI_ORGANIZATION_ID=your_openai_organization_id
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
GEMINI_CLIENT_EMAIL=your_gemini_client_email
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number


Replace `your_open_ai_secret`, `your_openai_organization_id`, `your_mongodb_url`, `your_jwt_secret`, `your_cookie_secret`, `your_gemini_api_key`, `your_gemini_client_email`, `your_twilio_account_sid`, `your_twilio_auth_token`, and `your_twilio_phone_number` with the actual values uploaded in the .env file code.

Frontend
Create a .env file in the frontend directory if needed. For this project, environment variables for the frontend are not explicitly required but may be added as needed for API endpoints or other configurations.

Usage
Once both servers are running, open your browser and navigate to http://localhost:5173/ to interact with the MEDBOT-AI application. You can signup with all details and then log in, chat with the bot, set medication reminders, and find nearby hospitals.

Technologies Used
Backend:

Node.js
Express.js
MongoDB
TypeScript
LANGCHAIN
JWT (JSON Web Tokens) for authentication
Twilio for SMS notifications
GEMINI API(u can use any other too) for chatbot functionality
HERE API for location and hospital data fetching

Frontend:

React
Vite
Material-UI (MUI)
React Router
Axios for HTTP requests
```
# Medical-Diagnostics-Chatbot
