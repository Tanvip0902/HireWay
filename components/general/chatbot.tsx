"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";

// Message interface
interface Message {
  id: number;
  text: string;
  type: "user" | "bot";
}

// Question interface
interface Question {
  id: string;
  question: string;
  answer: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]); // Store DB questions
  const [userInput, setUserInput] = useState(""); // User's text input
  const chatRef = useRef<HTMLDivElement>(null);

  // Fetch questions from API
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

  // Show welcome message on open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: 0, text: "Hi, I'm your assistant! How can I help today? 😊", type: "bot" }]);
    }
  }, [isOpen]);

  // Scroll to bottom when new messages appear
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle quick reply click
  const handleQuestionClick = (question: string, answer: string) => {
    setMessages((prev) => [
      ...prev,
      { id: prev.length, text: question, type: "user" },
      { id: prev.length + 1, text: answer, type: "bot" },
    ]);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!userInput.trim()) return; // Prevent empty messages

    const newMessage: Message = { id: messages.length, text: userInput, type: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput(""); // Clear input after sending
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbot Window */}
   
{isOpen && (
  <div className="fixed bottom-16 right-5 bg-white w-96 h-[450px] rounded-xl shadow-lg border border-gray-300 animate-fadeIn flex flex-col">
    {/* Header */}
    <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-xl">
      <h2 className="font-semibold text-sm">Customer Care Bot</h2>
      <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-400">
        <X size={20} />
      </button>
    </div>

    {/* Quick Reply Buttons - Make them side by side */}
    <div className="p-2 border-b border-gray-300 flex flex-wrap gap-2 justify-center">
      {questions.map((item) => (
        <button
          key={item.id}
          className="bg-white text-blue-500 px-3 py-2 text-xs rounded-full border border-blue-500 hover:bg-blue-100 transition whitespace-nowrap"
          onClick={() => handleQuestionClick(item.question, item.answer)}
        >
          {item.question}
        </button>
      ))}
    </div>

    {/* Chat Messages */}
    <div ref={chatRef} className="flex-1 overflow-y-auto p-2 space-y-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`max-w-[60%] px-3 py-2 text-sm rounded-lg shadow-md break-words ${
            msg.type === "user"
              ? "bg-blue-600 text-white self-end ml-auto text-left rounded-br-none max-w-[60%]"
              : "bg-gray-200 text-gray-800 self-start text-left rounded-bl-none max-w-[86%]"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>

    {/* Input Box & Send Button */}
    <div className="p-3 border-t border-gray-300 flex items-center gap-2 bg-white">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
      >
        <Send size={20} />
      </button>
    </div>
  </div>
)}

    </>
  );
}
