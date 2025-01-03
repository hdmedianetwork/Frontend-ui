import { useState, useEffect, useRef } from "react";
import { Mic, UserCircle2, PlayCircle, Clock, Send, X } from "lucide-react";
import { CustomModal } from "../../../ui/CustomModal";
import { getAccessToken } from "../../../services/api";
import Toast from "typescript-toastify";
import { useNavigate } from "react-router-dom";
// import { ScaleLoader } from "react-spinners/ScaleLoader";

const RecordingModal = ({ isOpen, onClose }) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Recording in Progress"
    >
      <div className="p-8 flex flex-col items-center justify-center gap-6 relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="relative w-20 h-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-3 h-8 bg-blue-500 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: "1s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-700 font-medium">
          Listening to your response...
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Stop Recording
        </button>
      </div>
    </CustomModal>
  );
};

export const Interview = () => {
  const navigate = useNavigate();

  // Core state
  // const [showInstructions, setShowInstructions] = useState(true);
  // const [showEndModal, setShowEndModal] = useState(false);
  // const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  // const [sessionId, setSessionId] = useState(null);
  // const [currentQuestionId, setCurrentQuestionId] = useState(null);
  // const [chat, setChat] = useState([]);

  const [showInstructions, setShowInstructions] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [chat, setChat] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const [interviewTimer, setInterviewTimer] = useState(30 * 60);
  const [questionTimer, setQuestionTimer] = useState(60);
  const [isQuestionTimerActive, setIsQuestionTimerActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [isTypingTimerStarted, setIsTypingTimerStarted] = useState(false);

  // Answer handling state
  // const [userAnswer, setUserAnswer] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [canSubmit, setCanSubmit] = useState(true);

  // Timer state
  // const [interviewTimer, setInterviewTimer] = useState(30 * 60);
  // const [questionTimer, setQuestionTimer] = useState(60);
  // const [isQuestionTimerActive, setIsQuestionTimerActive] = useState(false);

  // Recording state
  // const [isRecording, setIsRecording] = useState(false);
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
    if (
      isQuestionTimerActive &&
      questionTimer > 0 &&
      canSubmit &&
      isTypingTimerStarted
    ) {
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
  }, [isQuestionTimerActive, questionTimer, canSubmit, isTypingTimerStarted]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // const handleMicClick = async () => {
  //   if (!canSubmit) return;

  //   if (isRecording) {
  //     recognitionRef.current?.stop();
  //     setIsRecording(false);
  //     return;
  //   }

  //   if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
  //     showToast("Speech recognition not supported in this browser.");
  //     return;
  //   }

  //   try {
  //     const SpeechRecognition =
  //       window.SpeechRecognition || window.webkitSpeechRecognition;
  //     recognitionRef.current = new SpeechRecognition();
  //     recognitionRef.current.continuous = true;
  //     recognitionRef.current.interimResults = true;

  //     recognitionRef.current.onresult = (event) => {
  //       let finalTranscript = "";
  //       for (let i = event.resultIndex; i < event.results.length; i++) {
  //         const transcript = event.results[i][0].transcript;
  //         if (event.results[i].isFinal) {
  //           finalTranscript += transcript + " ";
  //         }
  //       }
  //       if (finalTranscript) {
  //         setUserAnswer((prev) => prev + finalTranscript);
  //       }
  //     };

  //     recognitionRef.current.start();
  //     setIsRecording(true);
  //     setIsQuestionTimerActive(true);
  //   } catch (error) {
  //     console.error("Error starting speech recognition:", error);
  //     showToast("Error starting speech recognition");
  //   }
  // };

  // Monitor userAnswer changes

  useEffect(() => {
    if (!isTypingTimerStarted && userAnswer.trim().length > 0) {
      setIsTypingTimerStarted(true);
      setIsQuestionTimerActive(true);
    }
  }, [userAnswer, isTypingTimerStarted]);

  const handleMicClick = async () => {
    if (!canSubmit) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setShowRecordingModal(false);
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
      setShowRecordingModal(true);
      setIsQuestionTimerActive(true);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      showToast("Error starting speech recognition");
    }
  };

  const handleManualSubmit = async () => {
    await handleSubmitAnswer(false);
    setUserAnswer("");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    // <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <div className="min-h-96 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Instructions Modal */}
      <CustomModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title={
          <div className="text-2xl font-bold text-gray-800">
            Welcome to Your Interview
          </div>
        }
        footer={
          <button
            onClick={handleStartInterview}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
          >
            Begin Interview
          </button>
        }
      >
        <div className="space-y-6 p-4">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Interview Guidelines
            </h3>
            <ul className="space-y-4">
              {[
                "Total duration: 30 minutes",
                "60 seconds per question",
                "Voice recording or typing available",
                "Auto-submission after timer ends",
              ].map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CustomModal>

      <RecordingModal
        isOpen={showRecordingModal}
        onClose={() => {
          setShowRecordingModal(false);
          setIsRecording(false);
          recognitionRef.current?.stop();
        }}
      />

      {/* End Interview Modal - Updated color */}
      <CustomModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        title={
          <div className="text-2xl font-bold text-gray-800">
            Interview Complete
          </div>
        }
        footer={
          <button
            onClick={() => navigate("/user/dashboard")}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
          >
            Return to Dashboard
          </button>
        }
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 text-blue-600">✓</div>
          </div>
          <p className="text-lg text-gray-700">
            Congratulations on completing your interview!
          </p>
        </div>
      </CustomModal>

      {/* <div className="max-w-4xl mx-auto p-6"> */}
      <div className="max-w-7xl mx-auto">
        {isInterviewStarted && (
          <div className="space-y-6">
            {/* Timer Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <span className="text-lg font-semibold">
                      Total Time: {formatTime(interviewTimer)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEndInterview(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium"
                  >
                    End Interview
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-blue-600" />
                      <span className="text-lg font-semibold text-blue-600">
                        Question Time: {formatTime(questionTimer)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(questionTimer / 60) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-80 overflow-y-auto mb-6 scroll-smooth">
                <div className="space-y-6">
                  {chat.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender === "User"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-5xl p-4 rounded-2xl ${
                          message.sender === "User"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="leading-relaxed">{message.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>

              <div className="flex gap-4">
                <textarea
                  ref={textAreaRef}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24 transition-all"
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleMicClick}
                    className={`p-4 rounded-xl ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white transition-all transform hover:scale-105`}
                  >
                    <Mic className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleManualSubmit}
                    className="p-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:scale-105"
                  >
                    <Send className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
