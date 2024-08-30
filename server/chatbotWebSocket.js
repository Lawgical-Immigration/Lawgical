const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const Message = require("./models/messageModel");
const path = require("path");
const fs = require("fs");
const supabase = require('../database/dbConfig')

dotenv.config();
const accessToken = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(accessToken);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const loadJsonFiles = (directoryPath) => {
  const files = fs.readdirSync(directoryPath);
  const data = [];

  files.forEach((file) => {
    if (path.extname(file) === ".json") {
      const filePath = path.join(directoryPath, file);
      const fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      data.push(fileData); // Push each JSON file data to an array
    }
  });
  return data;
};

const jsonData = loadJsonFiles("./parsedData");
const context = jsonData.map((data) => JSON.stringify(data)).join(" ");
const initial =
  "Use this as context to reply to my questions. If you can't find the answer here, search the internet.";

async function generateText(prompt) {
  const result = await model.generateContent(context + initial + prompt);
  const response = await result.response;
  const text = response.text();
  console.log("response text: ", text);
  return text;
}

// function to set up websocket
const chatbotWebSocket = (server) => {
  console.log("WebSocket setup function invoked");
  // initialize new instance of socket server and bind it to HTTP server instance
  const io = socketIo(server, {
    path: "/socket.io",
  });

  // handles websocket connections
  io.on("connection", (socket) => {
    console.log("New client connected");

    // listens for incoming messages
    socket.on("sendMessage", async (data) => {
      console.log("received sendMessage event and data is: ", data);
      const { convoID, sender, content } = data;


      const { data1, error } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: convoID,
            sender: sender,
            content: content
          }
        ])
      if (error) {
        console.log("Error inserting message: ", error)
      } else {
        console.log("Message inserted successfully: ", data1)
      }

      const botResponse = await generateText(content);
      console.log("botResponse: ", botResponse);

      if (botResponse) {
        try {
          const { data2, error } = await supabase
            .from("messages")
            .insert([
              {
                conversation_id: convoID,
                sender: "bot",
                content: botResponse
              }
            ])
          if (error) console.log("error occured while adding bot response to messages table: ", error)
          else {
            console.log("Bot message inserted successfully: ", data2);
          }
          io.to(convoID).emit("receiveMessage", data2);
        } catch (err) {
          console.log("failed to create message from bot response");
        }
      }
    });

    // handle joining a conversation room
    socket.on("joinConversation", (convoID) => {
      socket.join(convoID);
      console.log(`Client joined conversation: ${convoID}`);
    });

    // handle client disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

module.exports = chatbotWebSocket;
