import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
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
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
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
      .json({ message: "Something went wrong", cause: (error as any).message });
  }
};

// Function to format the response with Markdown bullet points
const formatResponse = (response) => {
  return response.replace(/\n\*\s/g, '\n* ');
};

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
    return res.status(200).json({ message: "ERROR", cause: (error as any).message });
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
    return res.status(200).json({ message: "ERROR", cause: (error as any).message });
  }
};
