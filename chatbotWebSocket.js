const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const socketIo = require('socket.io');
const Message = require('./employee-details-frontend/src/Models/messageModel');

dotenv.config();
const accessToken = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(accessToken);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

async function generateText(prompt) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log("response text: ", text);
  return text;
}

// function to set up websocket
const setupWebSocket = (server) => {
  console.log("WebSocket setup function invoked");
  // initialize new instance of socket server and bind it to HTTP server instance
  const io = socketIo(server, {
    path: '/socket.io',
  });
  // handles websocket connections
  io.on('connection', (socket) => {
    console.log("New client connected");
    // listens for incoming messages
    socket.on('sendMessage', async (data) => {
      const { convoID, sender, content } = data;
      // post message to database
      await Message.create({
        convoID,
        sender,
        content,
      });
      const botResponse = await generateText(content);
      console.log("botResponse: ", botResponse);
      if (botResponse) {
        try {
          const message = await Message.create({
            conversation: convoID,
            sender: 'bot',
            content: botResponse,
          });
          console.log("message that is being sent: ", message);
        } catch (err) {
          console.log("failed to create message from bot response")
        }
        

      }

      io.to(convoID).emit('receiveMessage', botResponse);
    })
    // handle joining a conversation room
    socket.on('joinConversation', (convoID) => {
      socket.join(convoID);
      console.log(`Client joined conversation: ${convoID}`);
    })
    // handle client disconnection
    socket.on('disconnect', () => {
      console.log("Client disconnected");
    })

  })
}

module.exports = setupWebSocket;