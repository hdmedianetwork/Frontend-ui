import { useState, useEffect, useRef } from "react";
import { Mic, UserCircle2, PlayCircle, Clock } from "lucide-react";
import { CustomModal } from "../../../ui/CustomModal";
import { getAccessToken } from "../../../services/api";
import Toast from "typescript-toastify";
import { useNavigate } from "react-router-dom";

export const Interview = () => {
  const navigate = useNavigate();

  // Core state
  const [showInstructions, setShowInstructions] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [chat, setChat] = useState([]);

  // Answer handling state
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);

  // Timer state
  const [interviewTimer, setInterviewTimer] = useState(30 * 60);
  const [questionTimer, setQuestionTimer] = useState(60);
  const [isQuestionTimerActive, setIsQuestionTimerActive] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const textAreaRef = useRef(null);
  const chatEndRef = useRef(null);

  // Submission lock mechanism
  const submissionLockRef = useRef(false);
  const currentQuestionRef = useRef(null);

  const showToast = (message, type = "default") => {
    new Toast({
      position: "top-center",
      toastMsg: message,
      autoCloseTime: 2000,
      canClose: true,
      showProgress: true,
      pauseOnHover: true,
      pauseOnFocusLoss: true,
      type: type,
      theme: "light",
    });
  };

  const handleStartInterview = async () => {
    try {
      const token = getAccessToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/qna/start-interview/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSessionId(data.session_id);
        sessionStorage.setItem("interviewSessionId", data.session_id);

        if (data.qna_id) {
          setCurrentQuestionId(data.qna_id);
          currentQuestionRef.current = data.qna_id;
          setChat([{ sender: "Bot", message: data.question }]);
          setIsInterviewStarted(true);
          setShowInstructions(false);
          setIsQuestionTimerActive(true);
          showToast("Interview Started", "default");
        }
      } else {
        throw new Error(data.message || "Failed to start interview");
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      showToast(error.message || "Failed to start interview");
    }
  };

  const handleSubmitAnswer = async (isAutoSubmit = false) => {
    if (submissionLockRef.current || isSubmitting || !canSubmit) {
      return;
    }

    const currentAnswer = userAnswer.trim();
    if (!currentAnswer && !isAutoSubmit) return;

    try {
      submissionLockRef.current = true;
      setIsSubmitting(true);
      setCanSubmit(false);
      setIsQuestionTimerActive(false);

      const qnaId = currentQuestionRef.current;

      setUserAnswer("");

      const token = getAccessToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/qna/submit-answer/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qna_id: qnaId,
            user_answer: currentAnswer || "No answer provided.",
            session_id: sessionStorage.getItem("interviewSessionId"),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setChat((prev) => [
          ...prev,
          { sender: "User", message: currentAnswer },
        ]);

        if (data.next_question) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setCurrentQuestionId(data.next_qna_id);
          currentQuestionRef.current = data.next_qna_id;

          setChat((prev) => [
            ...prev,
            { sender: "Bot", message: data.next_question },
          ]);

          setQuestionTimer(60);
          setCanSubmit(true);

          setTimeout(() => {
            setIsQuestionTimerActive(true);
          }, 500);
        } else if (data.is_complete) {
          showToast("Ending Interview", "default");
          handleEndInterview();
        }
      } else {
        throw new Error(data.message || "Failed to submit answer");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      showToast(error.message || "Failed to submit answer");
      setUserAnswer(currentAnswer); // Restore answer if submission failed
    } finally {
      setIsSubmitting(false);
      submissionLockRef.current = false;
    }
  };

  const handleEndInterview = async () => {
    try {
      if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
      }

      const token = getAccessToken();
      const storedSessionId = sessionStorage.getItem("interviewSessionId");

      await fetch(`${import.meta.env.VITE_API_URL}/qna/end-interview/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: storedSessionId,
        }),
      });

      sessionStorage.removeItem("interviewSessionId");
      setShowEndModal(true);
      showToast("Interview Ended", "default");
    } catch (error) {
      console.error("Error ending interview:", error);
      showToast("Error ending interview", "default");
    }
  };

  useEffect(() => {
    let interval;
    if (isInterviewStarted && interviewTimer > 0) {
      interval = setInterval(() => {
        setInterviewTimer((prev) => {
          if (prev <= 1) {
            handleEndInterview(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewStarted, interviewTimer]);

  useEffect(() => {
    let interval;
    if (isQuestionTimerActive && questionTimer > 0 && canSubmit) {
      interval = setInterval(() => {
        setQuestionTimer((prev) => {
          if (prev <= 1 && canSubmit) {
            handleSubmitAnswer(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuestionTimerActive, questionTimer, canSubmit]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleMicClick = async () => {
    if (!canSubmit) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      showToast("Speech recognition not supported in this browser.");
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
      setIsQuestionTimerActive(true);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      showToast("Error starting speech recognition");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="min-h-56 bg-gray-50 p-4 font-sans">
      {/* Instructions Modal */}
      <CustomModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="Interview Instructions"
        footer={
          <button
            onClick={handleStartInterview}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Interview
          </button>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Welcome to your interview! Here are some important points:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-600">
              The interview will last 30 minutes
            </li>
            <li className="text-gray-600">
              You have 60 seconds to answer each question
            </li>
            <li className="text-gray-600">
              You can type your answer or use voice recording
            </li>
            <li className="text-gray-600">
              Answers will auto-submit after 60 seconds
            </li>
          </ul>
        </div>
      </CustomModal>

      {/* End Interview Modal */}
      <CustomModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        title="Interview Completed"
        footer={
          <button
            onClick={() => navigate("/user/dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        }
      >
        <p className="text-gray-700">Thank you for completing the interview!</p>
      </CustomModal>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Interview Timer */}
        {isInterviewStarted && (
          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-4">
                <Clock className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-medium">
                  Interview Time: {formatTime(interviewTimer)}
                </span>
              </div>
              <button
                onClick={() => handleEndInterview(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                End Interview
              </button>
            </div>
          </div>
        )}

        {/* Question Timer */}
        {isInterviewStarted && (
          <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-4">
                <PlayCircle className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-medium text-red-600">
                  Question Time: {formatTime(questionTimer)}
                </span>
              </div>
              <div
                className={`px-6 py-2 text-white rounded-lg ${
                  isQuestionTimerActive ? "bg-blue-500" : "bg-gray-400"
                }`}
              >
                {isQuestionTimerActive ? "Timer Running" : "Timer Paused"}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(questionTimer / 60) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-4">
          {chat.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "User" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-xl ${
                  message.sender === "User"
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                <p>{message.message}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* Answer Input and Mic Button */}
        {isInterviewStarted && (
          <div className="flex items-center gap-4 mt-6">
            <textarea
              ref={textAreaRef}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
            />
            <button
              onClick={handleMicClick}
              className={`p-4 rounded-full ${
                isRecording ? "bg-red-500" : "bg-gray-500"
              } text-white`}
            >
              <Mic className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
