"use client";

import { useState } from "react";

export default function Chatbot() {
    const [chatHistory, setChatHistory] = useState<{ type: string; text: string }[]>([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // State to control popup visibility

    const sendMessage = async () => {
        if (!userInput) return;

        const userMessage = { type: "user", text: userInput };
        setChatHistory((prev) => [...prev, userMessage]);
        setUserInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userMessage.text }),
            });

            const data = await response.json();

            const botMessage = { type: "bot", text: data.reply || "No response from the bot." };
            setChatHistory((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error:", error);
            setChatHistory((prev) => [...prev, { type: "bot", text: "Error fetching response." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Chat Icon Button */}
            <button
                className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                💬
            </button>

            {/* Chat Popup */}
            {isOpen && (
                <div className="fixed bottom-16 right-6 w-80 bg-white shadow-lg rounded-lg p-4 border">
                    <div className="flex justify-between">
                        <h3 className="font-bold">Chatbot</h3>
                        <button onClick={() => setIsOpen(false)}>✖</button>
                    </div>

                    <div
                        className="h-60 overflow-y-scroll p-2 border rounded-md mb-4 bg-gray-50"
                        id="chat-history"
                    >
                        {chatHistory.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded-md mb-2 ${
                                    msg.type === "user"
                                        ? "text-right bg-blue-100"
                                        : "text-left bg-green-100"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                        }}
                        className="flex"
                    >
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="flex-grow p-2 border rounded-md mr-2"
                            placeholder="Enter your message"
                        />
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
