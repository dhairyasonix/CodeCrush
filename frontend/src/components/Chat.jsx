import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { cerateSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const { _id, firstName } = user || {};
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPatner, setChatPatner] = useState(null);
  const socketRef = useRef(null);
    const chatContainerRef = useRef(null);

  const fetchChatMessages = async () => {
    const chat = await axios(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatPartnerData = chat?.data?.participants.find(
      (user) => user._id.toString() === targetUserId
    );
    setChatPatner(chatPartnerData);

    // console.log(chat.data.messages);
    // console.log(chatPartnerData);
    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId.firstName,
        lastName: senderId.lastName,
        text: text,
      };
    });
    setMessage(chatMessages);
  };
  useEffect(() => {
    fetchChatMessages();
  }, []);
    useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [message]);


  useEffect(() => {
    if (!user) return;
    const socket = cerateSocketConnection();
    socketRef.current = socket;
    socket.emit("joinChat", { targetUserId });
    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessage((message) => [...message, { firstName, lastName, text }]);
    });
    return () => {
      socket.disconnect();
    };
  }, [_id, targetUserId, firstName]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        targetUserId,
        text: newMessage,
      });
    }
    setNewMessage("");
  };

  return (
    <div className="flex justify-center p-6">
      <div className="card bg-base-300 w-full sm:w-[80vh] h-[80vh] shadow-md flex flex-col">
        <div className="items-center flex h-14 ">
{      chatPatner&&    <img
            className="ml-4 w-10 rounded-full"
            alt="Avatar"
            src={chatPatner?.photoUrl}
          />}
          <h1 className="mx-2 py-4 text-xl font-bold border-b border-base-200">
            {chatPatner
              ? `${chatPatner.firstName} ${chatPatner.lastName}`
              : "Loading..."}
          </h1>
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-base-200">
          {message.map((msg, index) => {
            return (
              <div
                key={index}
                className={`chat ${
                  firstName === msg.firstName ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-header">{`${msg.firstName} ${msg.lastName}`}</div>
                <div className="chat-bubble">{msg.text}</div>
              </div>
            );
          })}
         
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 flex items-center border-t border-base-200"
        >
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            type="text"
            placeholder="Type a message..."
            className="input input-bordered w-full rounded-r-none"
          />
          <button
            onClick={handleSend}
            className="btn btn-success rounded-l-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
