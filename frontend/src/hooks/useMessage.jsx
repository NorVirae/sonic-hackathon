import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const sendMessage = async ({ audioString, textInput }) => {
    try {
      setLoading(true);
      console.log(textInput)

      const data = await axios({
        method: 'post',
        url: `${backendUrl}/chat`,
        data: { audio: audioString, textInput }
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

      console.log(err)
      const messages = err.response.messages;
      setMessages(messages);

      setMessageChat(messages[0]);
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
