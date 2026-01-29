// import { Configuration } from "openai";
// export const configureOpenAI = () => {
//   const config = new Configuration({
//     apiKey: process.env.OPEN_AI_SECRET,
//     organization: process.env.OPENAI_ORAGANIZATION_ID,
//   });
//   return config;
// };
export const configureGeminiAPI = () => {
    const geminiApiKey = process.env.GEMINI_API_KEY; // Your Gemini API key stored in an environment variable
    const geminiBaseURL = "https://api.gemini.com"; // Assuming a fixed base URL for Gemini's free API
    return {
        apiKey: geminiApiKey,
        baseURL: geminiBaseURL,
    };
};
//# sourceMappingURL=openai-config.js.map