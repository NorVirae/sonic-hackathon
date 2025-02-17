import React, { useState, useEffect } from "react";
import { RecordRTCPromisesHandler } from "recordrtc";

import { FaMicrophone, FaMicrophoneAltSlash } from "react-icons/fa";
import { useMessagingAPI } from "../../hooks/useMessage";

const AudioRecorder = ({ setTransactionHash }) => {
    const [isRecording, setIsRecording] = useState(false)
    const [audioUrl, setAudioUrl] = useState(null)
    let [stream, setStream] = useState(null)
    let [recorder, setRecorder] = useState(null)
    const [base64Webm, setBase64Webm] = useState(null)
    const { sendMessage } = useMessagingAPI();

    // Helper function: Convert Blob to Base64
    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]); // Remove the Data URL prefix
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(blob); // Read as Data URL
        });
    };


    const innitializeAudio = async () => {
        // Check supported MIME types and use the first available option
        const mimeType = MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : MediaRecorder.isTypeSupported("audio/ogg")
                ? "audio/ogg"
                : "";

        if (!mimeType) {
            throw new Error("No supported MIME types available for recording.");
        }

        console.log(mimeType, "MIME")
        let localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        setStream(localStream)
        let localRecorder = new RecordRTCPromisesHandler(localStream, {
            type: 'audio',
            mimeType: "audio/wav"
        });
        setRecorder(localRecorder);
        console.log(stream, recorder)
    }

    // Start Recording
    const startRecording = async () => {
        console.log(recorder,
            stream)

        if (recorder && stream) {
            setIsRecording(true)
            recorder.startRecording();
        }
    };

    // Stop Recording
    const stopRecording = async () => {
        if (recorder && stream) {
            await recorder.stopRecording();
            setIsRecording(false)
            let blob = await recorder.getBlob();
            const localBase64Webm = await blobToBase64(blob);
            setBase64Webm(localBase64Webm)
            console.log(localBase64Webm)
            sendMessage({ audioString: localBase64Webm, textInput: null })
            setTransactionHash(null)

            // setEnableTextBox(false)
            let audioUrla = URL.createObjectURL(blob);
            setAudioUrl(audioUrla)
            // invokeSaveAsDialog(blob);
        }

    };



    useEffect(() => {
        innitializeAudio()
    }, [])


    return (
        <div>


            <button
                onPointerDown={startRecording}
                onPointerUp={stopRecording}
                // onTouchStart={startRecording}
                // onTouchEnd={stopRecording}
                className={`${isRecording ? "animate-record btn-actives" : " btn-inactives"}   text-white p-6  font-semibold uppercase rounded-full`}>
                {isRecording ? <FaMicrophone fontSize={"30"} /> : <FaMicrophoneAltSlash fontSize={"30"} />}
            </button>

        </div>
    );
};

export default AudioRecorder;
