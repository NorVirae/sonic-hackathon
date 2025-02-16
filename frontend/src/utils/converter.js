export const convertToBase64 = async (setBase64, sampleAudio) => {
    try {
      // Fetch the audio file as a Blob
      const response = await fetch(sampleAudio);
      const blob = await response.blob();

      // Convert Blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setBase64(reader.result);
      };
    } catch (error) {
      console.error("Error converting to Base64:", error);
    }
  };