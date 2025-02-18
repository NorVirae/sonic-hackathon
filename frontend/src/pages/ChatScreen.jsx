import { useEffect, useRef, useState } from "react";
import AudioRecorder from "../components/sound/AudioRecorder";
import { useMessagingAPI } from "../hooks/useMessage";
import TalkLoader from "../components/loaders/TalkLoader";
import ThinkLoader from "../components/loaders/ThinkLoader";

export default function ChatScreen({ agentName = "ATM", hidden, ...props }) {
    const input = useRef();
    const { loading, talking, messageChat } = useMessagingAPI();
    const [enableTextBox, setEnableTextBox] = useState(false)
    const [transactionHash, setTrasactionHash] = useState(null)

    useEffect(() => {
        if (messageChat && messageChat.action) {
            setEnableTextBox(true)
        }
        if (messageChat && messageChat.transactionHash) {
            console.log(messageChat.transactionHash, "TransactionHash")
            if (messageChat.transactionHash.slice(0, 2) == "0x") {
                setTrasactionHash(messageChat.transactionHash)
            } else {
                setTrasactionHash("0x" + messageChat.transactionHash)
            }
        }
    }, [messageChat])


    if (hidden) {
        return null;
    }

    return (
        <>
            <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
                <div className="self-end backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
                    <h1 className="font-black text-xl">{agentName} Agent</h1>
                </div>
                <div className="w-full flex flex-col items-end justify-center gap-4">
                    {loading && <div className="self-end backdrop-blur-md  bg-opacity-100 p-4 rounded-lg align-items-center">
                        <ThinkLoader />
                    </div>}

                    {talking && <div className="self-end backdrop-blur-md  bg-opacity-100 p-4 rounded-lg align-items-center">
                        <TalkLoader />
                    </div>}
                    {transactionHash && <div className="self-start bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-md">
                        <h1 className="text-xl font-extrabold text-gray-800 mb-2">Transaction Hash</h1>
                        <button
                            onClick={() =>
                                window.open(
                                    "https://scan-testnet.sonic.org/tx/" + transactionHash,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                            className="pointer-events-auto px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Click to View
                        </button>
                    </div>}

                </div>
                <div className="flex items-center justify-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto ">
                    <AudioRecorder setTransactionHash={setTrasactionHash} loading={loading} message={messageChat} />

                </div>
            </div>
        </>
    );
};

