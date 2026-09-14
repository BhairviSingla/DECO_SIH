
 
 // ============================================================
// AquaCore - Person 5
// Voice / Multilingual Interface
//
// Flow:
// User speaks
//      ↓
// Browser Speech Recognition
//      ↓
// Recognized text
//      ↓
// Person 2 FastAPI
//      ↓
// /api/voice-query
//      ↓
// { "answer": "..." }
//      ↓
// Browser Speech Synthesis
// ============================================================


// ============================================================
// Speech Recognition
// ============================================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


// ============================================================
// Global state
// ============================================================

let recognition = null;

let isListening = false;

let receivedResult = false;


// Default language
// English is selected initially because the current
// Person 2 backend has been confirmed with English queries.

let selectedLanguage = "en-IN";


// ============================================================
// Person 2 Backend API
// ============================================================

const API_URL =
    "http://100.83.222.33:8000/api/voice-query";


// ============================================================
// Voice callbacks
// ============================================================

let voiceCallbacks = {

    onStart: null,

    onResult: null,

    onProcessing: null,

    onSpeaking: null,

    onResponse: null,

    onHistory: null,

    onEnd: null,

    onError: null

};


// ============================================================
// Set UI callbacks
// ============================================================

function setVoiceCallbacks(callbacks) {

    voiceCallbacks = {
        ...voiceCallbacks,
        ...callbacks
    };

}


// ============================================================
// Create Speech Recognition
// ============================================================

if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();


    // One command at a time
    recognition.continuous = false;


    // We only need the final result
    recognition.interimResults = false;


    // Use selected language
    recognition.lang =
        selectedLanguage;

}


// ============================================================
// Send recognized speech to backend
// ============================================================

async function sendToBackend(spokenText) {

    if (
        !spokenText ||
        !spokenText.trim()
    ) {

        throw new Error(
            "No voice text was received."
        );

    }


    console.log(
        "Sending query to backend:",
        spokenText
    );


    const response =
        await fetch(
            API_URL,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    query: spokenText.trim(),
                    language: selectedLanguage
                 })

            }
        );


    console.log(
        "Backend HTTP status:",
        response.status
    );


    if (!response.ok) {

        throw new Error(
            `Backend request failed with status ${response.status}`
        );

    }


    const data =
        await response.json();


    console.log(
        "FULL BACKEND RESPONSE:",
        data
    );


    // Backend contract:
    //
    // {
    //     "answer": "..."
    // }

    if (
        !data ||
        typeof data.answer !== "string" ||
        !data.answer.trim()
    ) {

        throw new Error(
            "Backend response does not contain a valid answer."
        );

    }


    const answer =
        data.answer.trim();


    console.log(
        "BACKEND ANSWER:",
        answer
    );


    return answer;

}


// ============================================================
// Text-to-Speech
// ============================================================

function speak(
    text,
    lang = selectedLanguage
) {

    return new Promise(
        (resolve, reject) => {

            // Check browser support
            if (
                !(
                    "speechSynthesis"
                    in window
                )
            ) {

                reject(
                    new Error(
                        "Text-to-Speech is not supported in this browser."
                    )
                );

                return;

            }


            // Check text
            if (
                !text ||
                !text.trim()
            ) {

                reject(
                    new Error(
                        "Nothing to speak."
                    )
                );

                return;

            }


            // Stop previous speech
            window.speechSynthesis.cancel();


            const utterance =
                new SpeechSynthesisUtterance(
                    text
                );


            // Use selected language
            utterance.lang = lang;


            // Normal speaking speed
            utterance.rate = 1;


            utterance.pitch = 1;


            utterance.volume = 1;


            // --------------------------------
            // Speech started
            // --------------------------------

            utterance.onstart = () => {

                console.log(
                    "Text-to-Speech started."
                );


                if (
                    voiceCallbacks.onSpeaking
                ) {

                    voiceCallbacks.onSpeaking();

                }

            };


            // --------------------------------
            // Speech completed
            // --------------------------------

            utterance.onend = () => {

                console.log(
                    "Text-to-Speech ended."
                );


                resolve();

            };


            // --------------------------------
            // Speech error
            // --------------------------------

            utterance.onerror =
                (event) => {

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


            // Start speaking
            window.speechSynthesis.speak(
                utterance
            );

        }
    );

}


// ============================================================
// Start listening
// ============================================================

function startListening() {

    // Browser doesn't support Speech Recognition
    if (!recognition) {

        const message =
            "Speech recognition is not supported in this browser.";

        console.error(message);


        if (
            voiceCallbacks.onError
        ) {

            voiceCallbacks.onError(
                message
            );

        }

        return;

    }


    // Already listening
    if (isListening) {

        console.warn(
            "Voice recognition is already running."
        );

        return;

    }


    try {

        isListening = true;

        receivedResult = false;


        // Make sure recognition uses
        // the latest selected language.

        recognition.lang =
            selectedLanguage;


        recognition.start();

    }

    catch (error) {

        isListening = false;


        console.error(
            "Could not start voice recognition:",
            error
        );


        if (
            voiceCallbacks.onError
        ) {

            voiceCallbacks.onError(
                "Could not start voice recognition."
            );

        }

    }

}


// ============================================================
// Speech Recognition Events
// ============================================================

if (recognition) {


    // --------------------------------------------------------
    // Recognition started
    // --------------------------------------------------------

    recognition.onstart = () => {

        isListening = true;

        receivedResult = false;


        console.log(
            "Voice recognition started."
        );


        if (
            voiceCallbacks.onStart
        ) {

            voiceCallbacks.onStart();

        }

    };


    // --------------------------------------------------------
    // Speech recognized
    // --------------------------------------------------------

    recognition.onresult =
        async (event) => {

            try {

                const spokenText =
                    event
                        .results[0][0]
                        .transcript
                        .trim();


                receivedResult = true;


                if (!spokenText) {

                    const message =
                        "No speech was recognized.";

                    console.warn(message);


                    if (
                        voiceCallbacks.onError
                    ) {

                        voiceCallbacks.onError(
                            message
                        );

                    }

                    return;

                }


                console.log(
                    "Farmer said:",
                    spokenText
                );


                // Send recognized text to UI
                if (
                    voiceCallbacks.onResult
                ) {

                    voiceCallbacks.onResult(
                        spokenText
                    );

                }


                // Show processing state
                if (
                    voiceCallbacks.onProcessing
                ) {

                    voiceCallbacks.onProcessing();

                }


                // ------------------------------------------------
                // Backend request
                // ------------------------------------------------

                console.log(
                    "Sending voice text to backend..."
                );


                const answer =
                    await sendToBackend(
                        spokenText
                    );


                console.log(
                    "Backend answer:",
                    answer
                );


                // Send answer to UI
                if (
                    voiceCallbacks.onResponse
                ) {

                    voiceCallbacks.onResponse(
                        answer
                    );

                }


                // Add to history
                if (
                    voiceCallbacks.onHistory
                ) {

                    voiceCallbacks.onHistory(
                        spokenText,
                        answer
                    );

                }


                // ------------------------------------------------
                // Speak backend answer
                // ------------------------------------------------

                await speak(
                    answer,
                    selectedLanguage
                );


                // Finished successfully
                if (
                    voiceCallbacks.onEnd
                ) {

                    voiceCallbacks.onEnd(
                        true
                    );

                }

            }

            catch (error) {

                console.error(
                    "Voice assistant error:",
                    error
                );


                if (
                    voiceCallbacks.onError
                ) {

                    voiceCallbacks.onError(
                        getUserFriendlyError(
                            error
                        )
                    );

                }

            }

        };


    // --------------------------------------------------------
    // Recognition error
    // --------------------------------------------------------

    recognition.onerror =
        (event) => {

            console.error(
                "Voice recognition error:",
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


                case "service-not-allowed":

                    message =
                        "Speech recognition service is not available.";

                    break;


                default:

                    message =
                        "Something went wrong with voice recognition.";

            }


            if (
                voiceCallbacks.onError
            ) {

                voiceCallbacks.onError(
                    message
                );

            }

        };


    // --------------------------------------------------------
    // Recognition ended
    // --------------------------------------------------------

    recognition.onend = () => {

        isListening = false;


        console.log(
            "Voice recognition ended."
        );


        // IMPORTANT:
        // Do not show an error here.
        //
        // onresult may already have triggered
        // backend processing and TTS.

    };

}


// ============================================================
// User-friendly error messages
// ============================================================

function getUserFriendlyError(
    error
) {

    const message =
        error &&
        error.message
            ? error.message
            : "";


    console.error(
        "Detailed error:",
        message
    );


    // Backend/network error
    if (
        message.includes(
            "Failed to fetch"
        )
    ) {

        return (
            "Unable to connect to AquaCore server. " +
            "Please check that the backend is running."
        );

    }


    // HTTP error
    if (
        message.includes(
            "Backend request failed"
        )
    ) {

        return (
            "AquaCore server returned an error. " +
            "Please try again."
        );

    }


    // TTS error
    if (
        message.includes(
            "Text-to-Speech"
        ) ||
        message.includes(
            "voice response"
        )
    ) {

        return (
            "I received the answer, " +
            "but I could not play the voice response."
        );

    }


    // Empty backend answer
    if (
        message.includes(
            "valid answer"
        )
    ) {

        return (
            "The server did not provide a valid answer."
        );

    }


    // Default
    return (
        "Sorry, I couldn't process your request. " +
        "Please try again."
    );

}


// ============================================================
// Change language
// ============================================================

function setLanguage(
    language
) {

    if (
        !language ||
        typeof language !== "string"
    ) {

        console.error(
            "Invalid language:",
            language
        );

        return;

    }


    selectedLanguage =
        language;


    if (recognition) {

        recognition.lang =
            selectedLanguage;

    }


    console.log(
        "Voice language changed to:",
        selectedLanguage
    );

}


// ============================================================
// Get selected language
// ============================================================

function getLanguage() {

    return selectedLanguage;

}


// ============================================================
// Exports
// ============================================================

export {

    startListening,

    speak,

    setLanguage,

    getLanguage,

    setVoiceCallbacks

};