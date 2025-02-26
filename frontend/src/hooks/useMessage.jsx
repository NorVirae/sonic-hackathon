import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_API_URL || "https://7a6a-2c0f-2a80-a46-4e10-475-95b0-4b35-31bb.ngrok-free.app";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const sendMessage = async ({ audioString, textInput }) => {
    try {
      setLoading(true);
      console.log(textInput)

      const data = await axios({
        method: 'post',
        url: `${backendUrl}/chat/atm/agent`,
        data: { audio: audioString, prompt: "", name: "atm" }
      })
      console.log(data, "DATA")

      setLoading(false);

      const messages = data.data.messages;
      setMessages(messages);
      setTalking(true)
      setMessageChat(messages[0]);

    } catch (err) {

      setLoading(false);
      setTalking(false)

      console.log(err, "EROR")
      if (err.response && err.response.data && err.response.data.error) {
        const messages = err.response.data.error;
        setMessages(messages);
        setMessageChat(messages[0]);
      }
    }

  };
  const [messageChat, setMessageChat] = useState();
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [talking, setTalking] = useState(false)
  const onMessagePlayed = () => {
    setMessages((messages) => {
      let newMessage = messages.slice(1)
      setMessageChat(newMessage[0])
      if (messages.length <= 1) {
        console.log(messages.length)
        setTalking(false)
      }
      return newMessage
    });

  };

  return (
    <MessageContext.Provider
      value={{
        sendMessage,
        messageChat,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        talking,
        setTalking
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessagingAPI = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessagingAPI must be used within a MessageProvider");
  }
  return context;
};
