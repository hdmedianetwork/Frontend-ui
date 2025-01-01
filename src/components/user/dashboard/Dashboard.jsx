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
} from "../../../services/api.js";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  // const [currentPage, setCurrentPage] = useState(0);
  // const questionsPerPage = 5;

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check if we have an access token
        const token = getAccessToken();
        if (!token) {
          navigate("/login");
          return;
        }

        // Try to get user data from sessionStorage first
        let userData = getUserData();

        // If no data in sessionStorage, fetch from API
        if (!userData) {
          const response = await fetchUserInfo();
          if (response.success) {
            userData = response.data;
          } else {
            throw new Error("Failed to fetch user data");
          }
        }

        // Format the user data for display
        setUser({
          name: userData.name,
          email: userData.email,
          phone_number: userData.phone_number,
          profileImage: userData.profile_path || "/assets/profile.png",
          role: userData.role,
          status: userData.status,
        });
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load user data");
        // If there's an error, logout and redirect to login
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <img
            src={user.profileImage}
            alt="Profile"
            className="h-28 w-28 rounded-full object-cover shadow-lg"
          />
          <div>
            <h2 className="text-4xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-lg text-gray-600">{user.email}</p>
            <p className="text-lg text-gray-600">{user.phone_number}</p>
            <p className="text-lg text-gray-600 capitalize">{user.role}</p>
            <p className="text-sm text-gray-400 capitalize">
              Status: {user.status}
            </p>
          </div>
        </div>
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
        <QuestionsTable />
      </div>
    </div>
  );
};
