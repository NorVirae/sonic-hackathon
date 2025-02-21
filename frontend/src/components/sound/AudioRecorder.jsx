import React, { useState, useEffect } from "react";
import { RecordRTCPromisesHandler } from "recordrtc";
import { FaMicrophone, FaMicrophoneAltSlash } from "react-icons/fa";
import { useMessagingAPI } from "../../hooks/useMessage";

const AudioRecorder = ({ setTransactionHash }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [stream, setStream] = useState(null);
    const [recorder, setRecorder] = useState(null);
    const [base64Webm, setBase64Webm] = useState(null);
    const { sendMessage } = useMessagingAPI();

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(blob);
        });
    };

    const initializeAudio = async () => {
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Audio permission granted");

            const localRecorder = new RecordRTCPromisesHandler(localStream, {
                type: 'audio',
                mimeType: "audio/webm",
            });

            setStream(localStream);
            setRecorder(localRecorder);
            return { localRecorder, localStream };
        } catch (error) {
            console.error("Error initializing audio:", error);
            alert("Error initializing audio: " + error);
            return null;
        }
    };

    const startRecording = async () => {
        try {
            const initialized = await initializeAudio();
            if (initialized) {
                const { localRecorder } = initialized;
                await localRecorder.startRecording();
                setIsRecording(true);
            }
        } catch (error) {
            console.error("Error starting recording:", error);
            setIsRecording(false);
        }
    };

    const stopRecording = async () => {
        try {
            if (!recorder) {
                console.error("No recorder instance found");
                return;
            }

            await recorder.stopRecording();
            setIsRecording(false);

            const blob = await recorder.getBlob();

            const localBase64Webm = await blobToBase64(blob);
            setBase64Webm(localBase64Webm);

            await sendMessage({ audioString: localBase64Webm, textInput: null });
            setTransactionHash(null);

            const audioUrla = URL.createObjectURL(blob);
            setAudioUrl(audioUrla);

            // Cleanup
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            setStream(null);
            setRecorder(null);
        } catch (error) {
            console.error("Error stopping recording:", error);
        }
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const handleToggleRecording = async () => {
        if (isRecording) {
            await stopRecording();
            // setIsRecording(false);
        } else {
            await startRecording();
        }
    };

    return (
        <div>
            <button
                onClick={handleToggleRecording}
                className={`${isRecording ? "animate-record btn-actives" : "btn-inactives"} text-white p-6 font-semibold uppercase rounded-full`}
            >
                {isRecording ? <FaMicrophone fontSize={"30"} /> : <FaMicrophoneAltSlash fontSize={"30"} />}
            </button>
        </div>
    );
};

export default AudioRecorder;