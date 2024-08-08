const React = require("react");
const { useState, useEffect } = React;
const io = require("socket.io-client");

const socket = io("http://127.0.0.1:5000");

function ChatInterface({ userID, userName }) {
  const [input, setInput] = useState("");
  const [convoID, setConvoID] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userID || !userName) {
      console.log("user ID or username not found in chatinterface");
      return;
    }
  
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/conversations/${userID}`
        );
        const data = await response.json();
        if (!data) console.log("Conversation not found for user id: ", userID);
        else {
          console.log("conversation id: ", data.convoID);
          setConvoID(data.convoID);
          setMessages(data.messages || []); // Correct typo
        }
      } catch (err) {
        console.log("error while retrieving user/conversation from userModel");
        console.log("error: ", err);
      }
    };
    fetchData();
  }, [userID, userName]);
  
  useEffect(() => {
    if (convoID) {
      socket.emit("joinConversation", convoID);
    }
    return () => {
      if (convoID) {
        socket.emit("leaveConversation", convoID);
      }
    };
  }, [convoID]);
  
  useEffect(() => {
    const handleMessage = (message) => {
      console.log("New message received: ", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    socket.on("receiveMessage", handleMessage);
  
    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, []);
  

  const sendMessage = () => {
    if (input.trim()) {
      console.log("Message being sent in sendMessage function!")
      socket.emit("sendMessage", {
        convoID,
        sender: userName,
        content: input,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: userName, content: input, timestamp: new Date() },
      ]);
      setInput("");
    }
  };

  return (
    <div>
      {convoID ? (
        <>
          <div>
            {messages.map((message, index) => (
              <div key={index}>
                {message.sender === "bot" ? "bot" : message.sender}:
                {message.content}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage}>Send</button>
        </>
      ) : (
        <div>Loading conversation...</div>
      )}
    </div>
  );
}

export default ChatInterface;
