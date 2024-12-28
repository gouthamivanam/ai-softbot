import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setshowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (userMessage) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };
    console.log(userMessage);
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content:
              "Hello! Welcome to our software support chatbot. My name is SoftBot, and I'm here to assist you with any software-related questions or issues you may have. Please feel free to ask me anything, and I'll do my best to provide you with helpful and accurate information.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        model: "llama3-8b-8192",
      });

      const responseContent =
        chatCompletion.choices[0]?.message?.content || "No response";
      updateHistory(responseContent);
    } catch (error) {
      console.log(error);
      const errorMsg = "no response or api failed";
      updateHistory(errorMsg, true);
    }
  };
  useEffect(() => {
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);
  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button
        onClick={() => setshowChatbot((prev) => !prev)}
        id="chatbot-toggler"
      >
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">AI Softbot</h2>
          </div>
          <button
            onClick={() => setshowChatbot((prev) => !prev)}
            className="material-symbols-rounded"
          >
            keyboard_arrow_down
          </button>
        </div>

        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there &#128075;
              <br />
              Welcome to our software support chatbot. My name is SoftBot, and
              I'm here to assist you with any software-related questions.
              <br /> How can I help you today?
            </p>
          </div>
          {/* Render the chat History dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default App;
