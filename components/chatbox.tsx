"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Bot, SendHorizonal, User } from "lucide-react";
import { PaperPlaneRight } from "@phosphor-icons/react";
import Link from "next/link";
import { TreeVisualization } from "./tree";

export function ChatBox() {


  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [curac, setCurac] = useState("");

  const messagesEndRef = useRef(null);
  const textRef = useRef(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;
  
    // Creating a new user message and adding it to the messages state
    const newUserMessage = { id: messages.length + 1, role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput("");
    setLoading(true);
  
    // Aggregate all messages into a single string
    const allMessagesContent = messages.map(m => {
      if (m.role === "user") {
          return `<Opponent>${m.content}</Opponent>`;
      } else if (m.role === "assistant") {
          return `<You>${m.content}</You>`;
      } else {
          return ""; // Handle other roles if needed
      }
    }).join(" ");
  
    // Simulate sending data to a server and getting a response
    try {
      const response = await fetch('http://localhost:8400/call_model/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          history: allMessagesContent + "<Opponent>" + input + "</Opponent>" // Concatenating previous content with new input
        })
      });
      const { response: {response: reply, action_id: actid} } = await response.json(); // Extract 'response' field from JSON
      setCurac(actid);
    const newAssistantMessage = { id: messages.length + 2, role: "assistant", content: reply };
      setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
    } catch (error) {
      console.error("Failed to fetch the assistant's reply:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  function handleKeyPress(event: any) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus the textarea on component mount
    if (textRef.current) {
      textRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Focus the textarea after the bot is done writing
    if (!isLoading && textRef.current) {
      textRef.current.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    if (textRef.current && textRef.current) {
      // reset the textarea height to auto to get the actual content height
      textRef.current.style.height = "auto";
      // set the height to the scrollHeight (actual content height)
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="flex flex-row min-h-screen w-full">
      <div className=" no-scrollbar flex flex-col justify-between max-h-screen w-full max-w-[600px] items-center font-sans
      px-8 py-8">
        <div
          className={`flex flex-col gap-2 overflow-y-scroll p-3 pt-4 w-full no-scrollbar
        ${messages.length < 1 && "invisible"}`}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className="flex flex-row md:gap-4 gap-2
            bg-white/60 backdrop-blur-lg rounded-lg shadow-md border border-neutral-100 p-3"
            >
              {m.role == "user" ? (
                <div className="w-[24px] h-[24px]">
                  <User size={24} color="black" />
                </div>
              ) : m.role == "assistant" ? (
                <div className="w-[24px] h-[24px]">
                  <Bot size={24} color="black" />
                </div>
              ) : (
                "???"
              )}
              <MarkdownPreview
                wrapperElement={{
                  "data-color-mode": "light",
                }}
                className="markdown-preview max-w-[600px]"
                source={m.content}
              />
            </div>
          ))}
          {messages.length > 1 && <div ref={messagesEndRef} />}
        </div>
        <div className="px-1 w-full flex">
          <form
            onSubmit={handleSubmit}
            className={`${
              (isLoading ) && "animate-pulse"
            } bg-white bottom-20 max-w-[800px] w-full border border-neutral-200 flex rounded-2xl  mx-2 shadow-2xl
        items-center overflow-hidden mb-4 min-h-[54px]`}
          >
            <textarea
              disabled={!!(isLoading )}
              ref={textRef}
              className="md:pl-6 pl-5 pr-4 py-4 w-full resize-none md:text-[15px] text-sm
            focus:outline-none no-scrollbar max-h-64"
              value={input}
              placeholder={
                !(isLoading )
                  ? "Compose a tweet."
                  : `Let him cook!`
              }
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              rows={8}
            />
            <div className="flex flex-col h-full justify-end pb-3">
              <button
                disabled={isLoading }
                type="submit"
                className={`bg-sky-400 ${
                  !(isLoading ) && "hover:bg-sky-300"
                } rounded-full shadow-md mr-3 p-3`}
              >
                <PaperPlaneRight size={20} color="white" weight="fill" className="-rotate-90" />
              </button>
            </div>
          </form>
        </div>
      </div>
      {curac.length > 0 && <div className="w-full"><TreeVisualization actionId={curac}/></div>}
    </div>
  );
}
