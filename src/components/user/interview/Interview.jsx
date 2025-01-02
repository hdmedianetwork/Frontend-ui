import { useState, useEffect, useRef } from "react";
import { Mic, UserCircle2, PlayCircle, Clock } from "lucide-react";
import { CustomModal } from "../../../ui/CustomModal";
import { Button } from "../../../ui/Button";
import { getAccessToken } from "../../../services/api";
import Toast from "typescript-toastify";

export const Interview = () => {
  // State management
  const [showInstructions, setShowInstructions] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);
  const [interviewTimer, setInterviewTimer] = useState(30 * 60);
  const [questionTimer, setQuestionTimer] = useState(60);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isQuestionTimerRunning, setIsQuestionTimerRunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [chat, setChat] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message, type = "error") => {
    new Toast({
      position: "bottom-right",
      toastMsg: message,
      autoCloseTime: 1000,
      canClose: true,
      showProgress: true,
      pauseOnHover: true,
      pauseOnFocusLoss: true,
      type: type,
      theme: "light",
    });
  };

  // Refs
  const textAreaRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Start interview handler
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
        // Store session ID in sessionStorage
        setSessionId(data.session_id);
        sessionStorage.setItem("interviewSessionId", data.session_id);

        // Set the first question ID (qna_id) here
        if (data.qna_id) {
          console.log(data.qna_id);

          setCurrentQuestionId(data.qna_id); // Update state with the received qna_id
        } else {
          console.error("No qna_id received from start-interview API");
          return;
        }

        // Add the first question to chat
        setChat([{ sender: "Bot", message: data.question }]);

        // Mark the interview as started and hide instructions
        showToast("Interview Started", "info");
        setIsInterviewStarted(true);
        setShowInstructions(false);
      } else {
        throw new Error(data.message || "Failed to start interview");
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      showToast(
        error.message || "Failed to start interview. Please try again."
      );
      // alert(error.message || "Failed to start interview. Please try again.");
    }
  };

  // const handleSubmitAnswer = async (isAutoSubmit = false) => {
  //   if (!currentQuestionId) {
  //     console.error("No question ID available");
  //     return;
  //   }

  //   if (!userAnswer.trim() && !isAutoSubmit) return;

  //   try {
  //     const token = getAccessToken();
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/qna/submit-answer/`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           qna_id: currentQuestionId,
  //           user_answer: userAnswer.trim() || "No answer provided.",
  //           session_id: sessionStorage.getItem("interviewSessionId"),
  //         }),
  //       }
  //     );

  //     const data = await response.json();

  //     if (response.ok) {
  //       // Add user's answer to chat
  //       setChat((prev) => [
  //         ...prev,
  //         {
  //           sender: "User",
  //           message: userAnswer.trim() || "No answer provided.",
  //         },
  //       ]);

  //       // If there's a next question, add it and update state
  //       if (data.next_question) {
  //         setChat((prev) => [
  //           ...prev,
  //           { sender: "Bot", message: data.next_question },
  //         ]);
  //         setCurrentQuestionId(data.qna_id);
  //         setUserAnswer("");
  //         setIsQuestionTimerRunning(false);
  //         setQuestionTimer(60);

  //         if (isRecording) {
  //           handleMicClick();
  //         }
  //       } else if (data.is_complete) {
  //         // Only end interview if explicitly marked as complete
  //         handleEndInterview();
  //       }
  //     } else {
  //       throw new Error(data.message || "Failed to submit answer");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting answer:", error);
  //     alert(error.message || "Failed to submit answer. Please try again.");
  //   }
  // };
  const handleSubmitAnswer = async (isAutoSubmit = false) => {
    // Ensure currentQuestionId is available before submitting an answer
    if (isSubmitting) return;

    if (!currentQuestionId) {
      console.error("No question ID available");
      showToast("No question ID available. Please try again.", "warning");
      // alert("No question ID available. Please try again.");
      return;
    }

    // Skip submission if there's no answer and auto-submit is not enabled
    if (!userAnswer.trim() && !isAutoSubmit) return;

    try {
      setIsSubmitting(true); // Set submission flag

      const currentAnswer = userAnswer.trim(); // Store current answer
      setUserAnswer(""); // Clear the input immediately to prevent resubmission

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
            qna_id: currentQuestionId,
            user_answer: userAnswer.trim() || "No answer provided.",
            session_id: sessionStorage.getItem("interviewSessionId"),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Add the user's answer to chat
        setChat((prev) => [
          ...prev,
          {
            sender: "User",
            message: currentAnswer || "No answer provided.",
          },
        ]);

        // setUserAnswer(""); // Reset the input field for the next answer
        setIsQuestionTimerRunning(false); // Reset the question timer
        setQuestionTimer(60); // Reset timer to 60 seconds

        // If there's a next question, add it and update the state
        if (data.next_question) {
          setChat((prev) => [
            ...prev,
            { sender: "Bot", message: data.next_question },
          ]);

          // showToast("Next quesion incoming", "info");
          // Update the question ID with the new one from the response (next_qna_id)
          setCurrentQuestionId(data.next_qna_id); // Update with next_qna_id
          // setUserAnswer(""); // Clear the user input field
          setIsQuestionTimerRunning(true); // Reset question timer
          // setQuestionTimer(60); // Reset the question timer to 60 seconds

          // Optionally restart mic if it's enabled
          if (isRecording) {
            handleMicClick();
            showToast("Recording Started", "info");
          }
        } else if (data.is_complete) {
          // End the interview if it's marked as complete
          showToast("Ending Interview", "info");
          handleEndInterview();
        }
      } else {
        throw new Error(data.message || "Failed to submit answer");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      showToast(error.message || "Failed to submit answer. Please try again.");
      // alert(error.message || "Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset submission flag
    }
  };

  // const handleEndInterview = async () => {
  //   try {
  //     const token = getAccessToken();
  //     const storedSessionId = sessionStorage.getItem("interviewSessionId");

  //     await fetch(`${import.meta.env.VITE_API_URL}/qna/end-interview/`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         session_id: storedSessionId,
  //       }),
  //     });
  //     showToast("Interview Ended", "info");
  //     sessionStorage.removeItem("interviewSessionId");
  //     setShowEndModal(true);
  //   } catch (error) {
  //     console.error("Error ending interview:", error);
  //   }
  // };

  // Interview timer effect
  const handleEndInterview = async (isTimerExpired = false) => {
    try {
      // First, stop any active recording
      if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
      }

      // Clear all timers
      setIsQuestionTimerRunning(false);

      // If there's a pending answer, submit it first
      if (userAnswer.trim()) {
        await handleSubmitAnswer(true);
      }

      const token = getAccessToken();
      const storedSessionId = sessionStorage.getItem("interviewSessionId");

      if (!storedSessionId) {
        showToast("No active interview session found.", "warning");
        setShowEndModal(true);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/qna/end-interview/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              session_id: storedSessionId,
              end_reason: isTimerExpired ? "timer_expired" : "user_ended",
              last_question_id: currentQuestionId,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to end interview properly");
        }

        // Update chat with end message
        setChat((prev) => [
          ...prev,
          {
            sender: "Bot",
            message: isTimerExpired
              ? "Interview time has expired. Thank you for your participation!"
              : "Interview ended. Thank you for your participation!",
          },
        ]);

        // Clean up interview state
        setIsInterviewStarted(false);
        setCurrentQuestionId(null);
        setUserAnswer("");

        // Clear session storage
        sessionStorage.removeItem("interviewSessionId");

        // Show appropriate notification
        showToast(
          isTimerExpired
            ? "Interview time expired"
            : "Interview ended successfully",
          isTimerExpired ? "warning" : "info"
        );

        // Show end modal
        setShowEndModal(true);
      } catch (error) {
        console.error("Error in end-interview API call:", error);
        showToast(error.message || "Error ending interview", "error");

        // Show end modal even if API fails
        setShowEndModal(true);
      }
    } catch (error) {
      console.error("Error in handleEndInterview:", error);
      showToast(
        "Error during interview completion. Please contact support.",
        "error"
      );
      setShowEndModal(true);
    }
  };
  useEffect(() => {
    let interval;
    if (isInterviewStarted && interviewTimer > 0) {
      interval = setInterval(() => {
        setInterviewTimer((prev) => {
          if (prev <= 1) {
            handleEndInterview(true);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewStarted, interviewTimer]);

  // Question timer effect
  useEffect(() => {
    let interval;
    if (isQuestionTimerRunning && questionTimer > 0) {
      interval = setInterval(() => {
        setQuestionTimer((prev) => {
          if (prev <= 1) {
            // setUserAnswer("");
            handleSubmitAnswer(true);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuestionTimerRunning, questionTimer]);

  // Chat scroll effect
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  // Speech recognition handlers
  const handleMicClick = async () => {
    setIsQuestionTimerRunning(true);

    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      showToast("Speech recognition not supported in this browser.");
      // alert("Speech recognition not supported in this browser.");
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
      showToast("Error starting speech recognition. Please try again.");
      // alert("Error starting speech recognition. Please try again.");
    }
  };

  const handleTextAreaChange = (e) => {
    setIsQuestionTimerRunning(true);
    setUserAnswer(e.target.value);
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
            onClick={() => window.location.reload()}
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
                onClick={handleEndInterview}
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
                  isQuestionTimerRunning ? "bg-blue-500" : "bg-gray-400"
                }`}
              >
                {isQuestionTimerRunning ? "Timer Running" : "Timer Ready"}
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

        {/* Chat Section */}
        {isInterviewStarted && (
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
                  onClick={() => handleSubmitAnswer(false)}
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
        )}
      </div>
    </div>
  );
};

export default Interview;
