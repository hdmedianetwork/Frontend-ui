import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button";
import { getUserData } from "../../services/api";
import { User, Mail, Shield } from "lucide-react";

const HorizontalNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const getPageName = () => {
    const path = location.pathname;
    const lastSegment = path.split("/").pop();
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  // const user = {
  //   name: "John Doe",
  //   email: "john@example.com",
  //   profileImage: "/assets/profile.png",
  //   role: "User",
  // };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Try to get user data from sessionStorage first
        let userData = getUserData();

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
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

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

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between fixed top-0 right-0 left-0 z-0">
      {/* Left section - empty for balance */}
      <div className="w-1/3 flex items-center justify-center">
        <span className="text-gray-600">{getPageName()}</span>
      </div>

      {/* Center section - App name */}
      <div className="w-1/3 flex justify-center items-center gap-3">
        <img src="/assets/logo.png" alt="" height={"45px"} width={"45px"} />
        <h1 className="text-xl font-bold">AI</h1>
      </div>

      {/* Right section - Page name and Profile */}
      <div className="w-1/3 flex items-center justify-end gap-6">
        {/* <span className="text-gray-600">{getPageName()}</span> */}

        {/* Profile section */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <img
              src="/assets/profile.png"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </button>

          {/* Profile dropdown */}
          {isProfileOpen && (
            <div className="absolute right-5 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 ">
              <div className="px-4 py-3 border-b border-gray-200 flex flex-col items-start justify-center gap-5 ">
                <div className="flex gap-3">
                  <User className="text-p-color" size={20} />
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Shield className="text-gray-500" size={18} />
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
                <div className="flex gap-3">
                  <Mail className="text-gray-500" size={18} />
                  <p className="text-sm text-gray-500  break-words max-w-full">
                    {user.email}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    const targetPath = location.pathname.startsWith("/admin")
                      ? "/admin/profile"
                      : "/user/profile";
                    navigate(targetPath);
                  }}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorizontalNavbar;
