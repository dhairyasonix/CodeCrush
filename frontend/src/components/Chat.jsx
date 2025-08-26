import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { cerateSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const { _id, firstName } = user || {}
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
   const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const socket = cerateSocketConnection();
    socketRef.current = socket;
    socket.emit("joinChat", { firstName, userId: _id, targetUserId });
    socket.on("messageReceived", ({ firstName, text }) => {
      
      setMessage((message) => [...message, { firstName, text }]);
    });
    return () => {
      socket.disconnect();
    };
  }, [_id, targetUserId,firstName]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
   if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        firstName,
        userId: _id,
        targetUserId,
        text: newMessage,
      });}
    setNewMessage("");
  };

  return (
    <div className="flex justify-center p-6">
      <div className="card bg-base-300 w-full sm:w-[80vh] h-[80vh] shadow-md flex flex-col">
        <div className="items-center flex ">
          <img
            className="ml-4 w-10 rounded-full"
            alt="Avatar"
            src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
          />

          <h1 className=" mx-2 py-4 text-xl font-bold border-b border-base-200">
            Dhairya
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-base-200">
          {message.map((msg, index) => {
            return (
              <div key={index} className={`chat ${firstName === msg.firstName?"chat-end":"chat-start"}`}>
                <div className="chat-header">{msg.firstName}</div>
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
