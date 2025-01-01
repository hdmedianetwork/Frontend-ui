import { useState, useEffect, useRef } from "react";
import { Mic, UserCircle2, PlayCircle } from "lucide-react";

export const Interview = () => {
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chat, setChat] = useState([
    {
      sender: "Bot",
      message:
        "Hello! Welcome to your interview. Start typing or click the microphone to begin. You'll have 60 seconds once you start.",
    },
    { sender: "Bot", message: "What is your name and give a brief about you." },
  ]);
  const [userAnswer, setUserAnswer] = useState("");
  const textAreaRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleSubmit(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }
  };

  const handleMicClick = async () => {
    startTimer(); // Start timer when mic is clicked

    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          }
        }
        if (finalTranscript) {
          setUserAnswer((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      alert("Error starting speech recognition. Please try again.");
    }
  };

  const handleSubmit = (isAutoSubmit = false) => {
    if (userAnswer.trim() || isAutoSubmit) {
      setChat((prevChat) => [
        ...prevChat,
        { sender: "User", message: userAnswer.trim() || "No answer provided." },
        {
          sender: "Bot",
          message:
            "Thank you for your answer. Start typing or use the microphone for the next question.",
        },
      ]);
      setUserAnswer("");
      setIsTimerRunning(false);
      setTimer(60);
      if (isRecording) {
        handleMicClick();
      }
    }
  };

  const handleTextAreaChange = (e) => {
    startTimer(); // Start timer on first keystroke
    setUserAnswer(e.target.value);
  };

  return (
    <div className="min-h-56 bg-gray-50 p-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Timer Section */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-4">
              <PlayCircle className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-medium text-red-600">
                Time Remaining: {Math.floor(timer / 60)}:
                {timer % 60 < 10 ? "0" + (timer % 60) : timer % 60}
              </span>
            </div>
            <div
              className={`px-6 py-2 text-white rounded-lg ${
                isTimerRunning ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              {isTimerRunning ? "Timer Running" : "Timer Ready"}
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(timer / 60) * 100}%` }}
            />
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-80 overflow-y-auto p-2 space-y-4">
            {chat.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "Bot" ? "justify-start" : "justify-end"
                } items-start gap-3`}
              >
                {message.sender === "Bot" && (
                  <UserCircle2 className="h-10 w-10 text-blue-500 flex-shrink-0" />
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-xl shadow-sm ${
                    message.sender === "Bot"
                      ? "bg-blue-50 text-gray-800"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {message.message}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Section */}
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <textarea
              ref={textAreaRef}
              value={userAnswer}
              onChange={handleTextAreaChange}
              placeholder="Start typing your answer..."
              className="w-full h-24 p-4 mb-1 border rounded-xl resize-none transition-colors duration-200 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-4">
              <button
                onClick={handleMicClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                <Mic className="h-5 w-5" />
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={!userAnswer.trim()}
                className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                  userAnswer.trim()
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
