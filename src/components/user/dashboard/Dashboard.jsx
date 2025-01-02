import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../ui/Card";
import { FileText } from "lucide-react";
import QuestionsTable from "../../../ui/QuestionsTable";
import {
  mockInterviews,
  // mockQuestions
} from "../../../utils/array.js";
import {
  fetchUserInfo,
  getUserData,
  getAccessToken,
  logout,
  fetchUserQna,
  loadInitialUserData,
} from "../../../services/api.js";
import Toast from "typescript-toastify";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [qna, setQna] = useState(null);
  // const [currentPage, setCurrentPage] = useState(0);
  // const questionsPerPage = 5;

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

  // useEffect(() => {
  //   const loadUserData = async () => {
  //     try {
  //       // Check if we have an access token
  //       const token = getAccessToken();
  //       if (!token) {
  //         navigate("/login");
  //         return;
  //       }

  //       // Try to get user data from sessionStorage first
  //       let userData = getUserData();

  //       // If no data in sessionStorage, fetch from API
  //       if (!userData) {
  //         const response = await fetchUserInfo();
  //         if (response.success) {
  //           userData = response.data;
  //         } else {
  //           throw new Error("Failed to fetch user data");
  //         }
  //       }
  //       // Format the user data for display
  //       setUser({
  //         name: userData.name,
  //         email: userData.email,
  //         phone_number: userData.phone_number,
  //         profileImage: userData.profile_path || "/assets/profile.png",
  //         role: userData.role,
  //         status: userData.status,
  //       });

  //       const response = await fetchUserQna();
  //       if (response.success) {
  //         let userQna = response.qna_list.slice(0, 20);
  //         setQna(userQna);
  //         console.log(userQna);
  //       } else {
  //         throw new Error("Failed to get user qna");
  //       }
  //     } catch (err) {
  //       console.error("Error loading user data:", err);
  //       showToast(err.message || "Failed to load user data");
  //       // setError("Failed to load user data");
  //       // If there's an error, logout and redirect to login
  //       logout();
  //       navigate("/login");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadUserData();
  // }, [navigate]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Load user data using the new function
        const userData = await loadInitialUserData();
        if (!userData) {
          navigate("/login");
          return;
        }

        // Set user state with the correct data structure
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone_number: userData.phone_number,
          profileImage: userData.profile_path || "/assets/profile.png",
          role: userData.role || "user",
          status: userData.status || "active",
          isActive: userData.isActive,
        });

        // Load QNA data
        const qnaResponse = await fetchUserQna();
        if (qnaResponse.success) {
          setQna(qnaResponse.qna_list.slice(0, 20));
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        if (err.message.includes("token")) {
          logout();
          navigate("/login");
        } else {
          setError("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  const handleDownloadReport = (reportName) => {
    alert(`Downloading ${reportName}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  // const totalPages = Math.ceil(mockQuestions.length / questionsPerPage);
  // const paginatedQuestions = mockQuestions.slice(
  //   currentPage * questionsPerPage,
  //   (currentPage + 1) * questionsPerPage
  // );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto flex flex-col gap-11">
      {/* Profile Header */}
      {/* Welcome Message */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, <span className="text-blue-600">{user.name}</span>!
        </h1>
        <p className="text-lg text-gray-600">We're glad to have you here.</p>
      </div>

      {/* Interview Reports Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockInterviews.map((interview) => (
          <div key={interview.id} className="bg-white p-6 rounded-lg shadow-md">
            <button
              onClick={() => handleDownloadReport(interview.report)}
              className="w-full flex flex-col items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText size={48} className="text-blue-600" />
              <div className="text-center">
                <p className="font-medium text-gray-900">{interview.report}</p>
                <p className="text-sm text-gray-500">{interview.date}</p>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Performance Overview */}
      <Card className="w-full p-6">
        <h3 className="text-2xl font-semibold mb-4">Interview Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockInterviews.map((interview) => (
            <div key={interview.id} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-lg">{interview.topic}</h4>
              <div className="mt-2 space-y-2">
                <p>
                  Score: <span className="font-medium">{interview.score}%</span>
                </p>
                <p>Duration: {interview.duration}</p>
                <p>Date: {interview.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="p-8">
        <h3 className="text-2xl font-semibold mb-4">
          Interview Questions Review
        </h3>
        <QuestionsTable qna={qna} />
      </div>
    </div>
  );
};
