
 
 // AquaCore - Person 5
// Voice / Multilingual Interface

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let isListening = false;
let receivedResult = false;

let selectedLanguage = "hi-IN";

// Person 2 API
const API_URL = "http://127.0.0.1:8000/api/voice-query";

let voiceCallbacks = {
  onStart: null,
  onResult: null,
  onProcessing: null,
  onSpeaking: null,
  onEnd: null,
  onError: null
};


// ------------------------------
// Set UI callbacks
// ------------------------------

function setVoiceCallbacks(callbacks) {
  voiceCallbacks = {
    ...voiceCallbacks,
    ...callbacks
  };
}


// ------------------------------
// Create Speech Recognition
// ------------------------------

if (SpeechRecognition) {

  recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = selectedLanguage;
}


// ------------------------------
// Send text to Person 2 API
// ------------------------------

async function sendToBackend(spokenText) {

  if (!spokenText || !spokenText.trim()) {
    throw new Error("No voice text was received.");
  }

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      query: spokenText
    })
  });


  if (!response.ok) {
    throw new Error(
      `Backend request failed with status ${response.status}`
    );
  }


  const data = await response.json();


  if (!data.answer) {
    throw new Error(
      "Backend response does not contain an answer."
    );
  }


  return data.answer;
}


// ------------------------------
// Text-to-Speech
// ------------------------------

function speak(text, lang = selectedLanguage) {

  return new Promise((resolve, reject) => {

    if (!("speechSynthesis" in window)) {

      reject(
        new Error(
          "Text-to-Speech is not supported in this browser."
        )
      );

      return;
    }


    if (!text || !text.trim()) {

      reject(
        new Error("Nothing to speak.")
      );

      return;
    }


    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = lang;


    utterance.onstart = () => {

      console.log("Text-to-Speech started.");

      if (voiceCallbacks.onSpeaking) {
        voiceCallbacks.onSpeaking();
      }

    };


    utterance.onend = () => {

      console.log("Text-to-Speech ended.");

      resolve();

    };


    utterance.onerror = (event) => {

      console.error(
        "Text-to-Speech error:",
        event.error
      );

      reject(
        new Error(
          "Could not play the voice response."
        )
      );

    };


    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(utterance);

  });
}


// ------------------------------
// Start Listening
// ------------------------------

function startListening() {

  if (!recognition) {

    const message =
      "Speech recognition is not supported in this browser.";

    console.error(message);

    if (voiceCallbacks.onError) {
      voiceCallbacks.onError(message);
    }

    return;
  }


  if (isListening) {

    console.warn(
      "Voice recognition is already running."
    );

    return;
  }


  try {

    isListening = true;

    receivedResult = false;

    recognition.lang = selectedLanguage;

    recognition.start();

  } catch (error) {

    isListening = false;

    console.error(
      "Could not start voice recognition:",
      error
    );

    if (voiceCallbacks.onError) {
      voiceCallbacks.onError(
        "Could not start voice recognition."
      );
    }

  }
}


// ------------------------------
// Recognition Events
// ------------------------------

if (recognition) {


  // Listening started

  recognition.onstart = () => {

    isListening = true;

    receivedResult = false;

    console.log(
      "Voice recognition started."
    );

    if (voiceCallbacks.onStart) {
      voiceCallbacks.onStart();
    }

  };


  // Speech recognized

  recognition.onresult = async (event) => {

    const spokenText =
      event.results[0][0].transcript.trim();

    receivedResult = true;


    if (!spokenText) {

      const message =
        "No speech was recognized.";

      console.warn(message);

      if (voiceCallbacks.onError) {
        voiceCallbacks.onError(message);
      }

      return;
    }


    console.log(
      "Farmer said:",
      spokenText
    );


    if (voiceCallbacks.onResult) {
      voiceCallbacks.onResult(spokenText);
    }


    // ------------------------------
    // Processing
    // ------------------------------

    if (voiceCallbacks.onProcessing) {
      voiceCallbacks.onProcessing();
    }


    try {

      console.log(
        "Sending voice text to backend..."
      );


      const answer =
        await sendToBackend(spokenText);


      console.log(
        "Backend answer:",
        answer
      );


      // ------------------------------
      // Speak backend answer
      // ------------------------------

      await speak(
        answer,
        selectedLanguage
      );


      if (voiceCallbacks.onEnd) {
        voiceCallbacks.onEnd();
      }


    } catch (error) {

      console.error(
        "Voice assistant error:",
        error
      );


      if (voiceCallbacks.onError) {

        voiceCallbacks.onError(
          "Sorry, I couldn't process your request. Please try again."
        );

      }

    }

  };


  // ------------------------------
  // Recognition error
  // ------------------------------

  recognition.onerror = (event) => {

    console.error(
      "Voice error:",
      event.error
    );


    let message;


    switch (event.error) {

      case "not-allowed":
        message =
          "Microphone permission was denied.";
        break;


      case "no-speech":
        message =
          "No speech was detected. Please try again.";
        break;


      case "audio-capture":
        message =
          "No microphone was detected.";
        break;


      case "network":
        message =
          "A network error occurred during speech recognition.";
        break;


      case "aborted":
        message =
          "Voice recognition was stopped.";
        break;


      default:
        message =
          "Something went wrong with voice recognition.";
    }


    if (voiceCallbacks.onError) {
      voiceCallbacks.onError(message);
    }

  };


  // ------------------------------
  // Recognition ended
  // ------------------------------

  recognition.onend = () => {

    isListening = false;

    console.log(
      "Voice recognition ended."
    );


    // If there was no result, show no-speech error.

    if (!receivedResult) {

      const message =
        "No speech was detected. Please try again.";

      console.warn(message);

      if (voiceCallbacks.onError) {
        voiceCallbacks.onError(message);
      }

    }

  };

}


// ------------------------------
// Language
// ------------------------------

function setLanguage(language) {

  selectedLanguage = language;

  if (recognition) {
    recognition.lang = language;
  }

  console.log(
    "Voice language changed to:",
    language
  );

}


function getLanguage() {
  return selectedLanguage;
}


// ------------------------------
// Export
// ------------------------------

export {
  startListening,
  speak,
  setLanguage,
  getLanguage,
  setVoiceCallbacks
};