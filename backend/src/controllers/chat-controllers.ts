// import { NextFunction, Request, Response } from "express";
// import User from "../models/User.js";
// import { configureOpenAI } from "../config/openai-config.js";
// // import { configureGeminiAPI } from "../config/openai-config.js";

// import { OpenAIApi, ChatCompletionRequestMessage } from "openai";
// export const generateChatCompletion = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { message } = req.body;
//   try {
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user)
//       return res
//         .status(401)
//         .json({ message: "User not registered OR Token malfunctioned" });
//     // grab chats of user
//     const chats = user.chats.map(({ role, content }) => ({
//       role,
//       content,
//     })) as ChatCompletionRequestMessage[];
//     chats.push({ content: message, role: "user" });
//     user.chats.push({ content: message, role: "user" });

//     // send all chats with new one to openAI API
//     const config = configureOpenAI();
//     const openai = new OpenAIApi(config);
//     // get latest response
//     const chatResponse = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: chats,
//     });
//     user.chats.push(chatResponse.data.choices[0].message);
//     await user.save();
//     return res.status(200).json({ chats: user.chats });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

// export const sendChatsToUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     //user token check
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user) {
//       return res.status(401).send("User not registered OR Token malfunctioned");
//     }
//     if (user._id.toString() !== res.locals.jwtData.id) {
//       return res.status(401).send("Permissions didn't match");
//     }
//     return res.status(200).json({ message: "OK", chats: user.chats });
//   } catch (error) {
//     console.log(error);
//     return res.status(200).json({ message: "ERROR", cause: error.message });
//   }
// };

// export const deleteChats = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     //user token check
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user) {
//       return res.status(401).send("User not registered OR Token malfunctioned");
//     }
//     if (user._id.toString() !== res.locals.jwtData.id) {
//       return res.status(401).send("Permissions didn't match");
//     }
//     //@ts-ignore
//     user.chats = [];
//     await user.save();
//     return res.status(200).json({ message: "OK" });
//   } catch (error) {
//     console.log(error);
//     return res.status(200).json({ message: "ERROR", cause: error.message });
//   }
// };

import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import chalk from 'chalk';
import { GoogleGenerativeAI } from "@google/generative-ai";

//newly added code
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const promptTemplate = PromptTemplate.fromTemplate(
  `Chat History:
{chat_history}
Assume you are a state-of-the-art medical diagnostics chat bot doing online patient assessment (so you must answer only what a doctor will answer).
{query}?`
);

const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_NONE",
  },
];

const model = new ChatGoogleGenerativeAI({
  apiKey: "AIzaSyDiIQ-KHiHvP27GDwl8PC9n6tPybHAP0RY",
  model: "gemini-pro",
  temperature: 0,
  maxOutputTokens: 2048,
  safetySettings: safetySettings,
});

const parser = new StringOutputParser();
const chain = promptTemplate.pipe(model).pipe(parser);

const formatChatHistory = (chatHistory) => {
  return chatHistory
    .map((message) => {
      if (message.role === "user") {
        return `Human: ${message.content}`;
      } else if (message.role === "assistant") {
        return `AI: ${message.content}`;
      }
      return "";
    })
    .join("\n");
};

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    user.chats.push({ content: message, role: "user" });
    const formattedChatHistory = formatChatHistory(user.chats);

    const response = await chain.invoke({
      query: message,
      chat_history: formattedChatHistory,
    });

    const aiResponse = response; // response is already a string

    // Ensure the response contains properly formatted Markdown
    const formattedResponse = formatResponse(aiResponse);

    user.chats.push({ content: formattedResponse, role: "assistant" });
    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", cause: error.message });
  }
};

// Function to format the response with Markdown bullet points
const formatResponse = (response) => {
  return response.replace(/\n\*\s/g, '\n* ');
};

// Ensure the following functions are correctly exported:
export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};


// export const generateChatCompletion = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { message } = req.body;
//   // console.log(message + "inside the chat-controllers");
  
//   try {
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user)
//       return res
//     .status(401)
//     .json({ message: "User not registered OR Token malfunctioned" });
//     // grab chats of user
//     const chats = user.chats.map(({ role, content }) => ({
//       role,
//       content,
//     }));
    
//     chats.push({ content: message, role: "user" });
//     user.chats.push({ content: message, role: "user" });

//     // Assuming 'user.chats' is an array of chat objects with 'content' and 'role'
//     // Concatenate the last N chats to form the conversation history
//     const historySize = 5; // Adjust based on the model's token limit and average message size
//     const recentChats = user.chats.slice(-historySize).map(chat => `${chat.role === 'user' ? 'User:' : 'Bot:'} ${chat.content}`).join('\n');
    
//     // Add the new user message to the history
//     const fullPrompt = `${recentChats}\nUser: ${message}\nBot:`;

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//     });
//     // const prompt = "hello";
//     const result = await model.generateContent(fullPrompt);
//     const chatResponse  = await result.response;
//     console.log(chatResponse.text() + "message from google");
//     // console.log(chalk.red(message) + " message from google");
//     // const formattedText = chalk.blue(chatResponse.text());
//     user.chats.push({ content: chatResponse.text(), role: "user" });
//     await user.save();

//     return res.status(200).json({ chats: user.chats });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

// export const sendChatsToUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     //user token check
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user) {
//       return res.status(401).send("User not registered OR Token malfunctioned");
//     }
//     if (user._id.toString() !== res.locals.jwtData.id) {
//       return res.status(401).send("Permissions didn't match");
//     }
//     return res.status(200).json({ message: "OK", chats: user.chats });
//   } catch (error) {
//     console.log(error);
//     return res.status(200).json({ message: "ERROR", cause: error.message });
//   }
// };

// export const deleteChats = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     //user token check
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user) {
//       return res.status(401).send("User not registered OR Token malfunctioned");
//     }
//     if (user._id.toString() !== res.locals.jwtData.id) {
//       return res.status(401).send("Permissions didn't match");
//     }
//     //@ts-ignore
//     user.chats = [];
//     await user.save();
//     return res.status(200).json({ message: "OK" });
//   } catch (error) {
//     console.log(error);
//     return res.status(200).json({ message: "ERROR", cause: error.message });
//   }
// };

