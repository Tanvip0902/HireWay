"use client";

import { useState, useEffect, useRef } from "react";
import {  X, Send,Bot } from "lucide-react";

interface Message {
  id: number;
  text: string;
  type: "user" | "bot";
}

interface Question {
  id: string;
  question: string;
  answer: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userInput, setUserInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/chatbot");
        const data: Question[] = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: 0, text: "Hi, I'm your assistant! How can I help today? 😊", type: "bot" },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuestionClick = async (question: string, answer: string) => {
    const userMessage: Message = {
      id: messages.length,
      text: question,
      type: "user",
    };
  
    setMessages((prev) => [...prev, userMessage]);
  
    // Typing effect logic
    let currentText = "";
    const words = answer.split(" ");
    const botId = messages.length + 1;
  
    setMessages((prev) => [...prev, { id: botId, text: "", type: "bot" }]);
  
    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 70)); // Speed (ms per word)
      currentText += (i === 0 ? "" : " ") + words[i];
  
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botId ? { ...msg, text: currentText } : msg
        )
      );
    }
  };
  

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
  
    const userMessage: Message = {
      id: messages.length,
      text: userInput,
      type: "user",
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setUserInput(""); // Clear input immediately
  
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
  
      const data = await res.json();
      const answer = data.answer || "Sorry, I didn't understand that.";
  
      // Typing effect logic
      let currentText = "";
      const words = answer.split(" ");
      const botId = messages.length + 1;
  
      setMessages((prev) => [...prev, { id: botId, text: "", type: "bot" }]);
  
      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 70)); // Speed (ms per word)
        currentText += (i === 0 ? "" : " ") + words[i];
  
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId ? { ...msg, text: currentText } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error fetching bot reply:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 1,
          text: "Something went wrong. Please try again later.",
          type: "bot",
        },
      ]);
    }
  };
  
  return (
    <>
      {/* Floating Chatbot Button */}
      <button
  onClick={() => setIsOpen(!isOpen)}
  className="fixed bottom-5 right-5 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition"
>
  <Bot size={24} /> {/* Adjusted icon size */}
</button>


      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-5 bg-white w-80 h-[400px] rounded-xl shadow-lg border border-gray-300 flex flex-col text-xs">

          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-xl">
            <h2 className="font-semibold text-sm">Customer Care Bot</h2>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-400">
              <X size={20} />
            </button>
          </div>

          {/* Quick Reply Buttons */}
          <div className="p-2 border-b border-gray-200 grid grid-cols-2 gap-2 justify-center">
            {questions.map((item) => (
              <button
                key={item.id}
                onClick={() => handleQuestionClick(item.question, item.answer)}
                className="text-[10px] px-2 py-1 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-100 transition text-center whitespace-normal break-words leading-tight"
              >
                {item.question}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-2 space-y-2 bg-white"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[70%] px-3 py-1 text-[12px] rounded-lg shadow-sm break-words leading-tight ${
                  msg.type === "user"
                    ? "bg-blue-600 text-white self-end ml-auto text-left rounded-br-none"
                    : "bg-gray-200 text-gray-800 self-start text-left rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-gray-300 flex items-center gap-2 bg-white">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
