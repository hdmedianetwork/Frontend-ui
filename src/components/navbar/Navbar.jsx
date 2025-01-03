import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  Settings,
  LogOut,
  FileText,
  FileChartColumnIncreasing,
  IdCard,
  MessageSquareQuote,
  UserCheck,
  IndianRupee,
  Handshake,
  X,
  UserPen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAccessToken, logout } from "../../services/api";

// Vertical Navbar Component
export const Navbar = ({ toggleNavbar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check if we have an access token
        const token = getAccessToken();
        if (!token) {
          navigate("/login");
          return;
        }
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

  const handleLogout = () => {
    logout();
    navigate("/login");
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

  return (
    <div className=" w-52 fixed left-0 top-0 h-full bg-d-color text-bg-color p-4 flex flex-col transition-transform ease-in-out z-50 ">
      <div className="flex justify-between items-center mb-10">
        <div className="text-2xl font-bold text-bg-color font-head">
          Tab Bar
        </div>
        <button
          onClick={toggleNavbar}
          className="text-bg-color hover:text-p-color p-2"
        >
          <X size={24} />
        </button>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-4">
          {isAdmin ? (
            <>
              <NavItem icon={<Home />} text="Dashboard" path="/admin/profile" />
              <NavItem
                icon={<FileChartColumnIncreasing />}
                text="Performance"
                path="/admin/history"
              />
              {/* <NavItem
                icon={<Users />}
                text="User Information"
                path="/admin/information"
              /> */}
              <NavItem
                icon={<IdCard />}
                text="User Permission"
                path="/admin/permission"
              />
              <NavItem
                icon={<MessageSquareQuote />}
                text="User Feedback"
                path="/admin/response"
              />
              {/* <NavItem
                icon={<UserCheck />}
                text="Subscriptions"
                path="/admin/subscription"
              /> */}
              {/* <NavItem
                icon={<IndianRupee />}
                text="Transaction History"
                path="/admin/transaction"
              /> */}
            </>
          ) : (
            <>
              <NavItem
                icon={<Home />}
                text="Dashboard"
                path="/user/dashboard"
              />
              <NavItem icon={<UserPen />} text="Profile" path="/user/profile" />
              <NavItem
                icon={<FileText />}
                text="Upload Resume"
                path="/user/upload-Resume"
              />
              <NavItem
                icon={<Calendar />}
                text="Schedule"
                path="/user/schedule"
              />
              {/* <NavItem
                icon={<Settings />}
                text="Payment"
                path="/user/payment"
              /> */}
              <NavItem
                icon={<Handshake />}
                text="Interview"
                path="/user/interview"
              />
              <NavItem icon={<Users />} text="Feedback" path="/user/feedback" />
            </>
          )}
        </ul>
      </nav>
      <button
        className="flex items-center text-bg-color hover:text-p-color mt-auto p-2"
        onClick={handleLogout}
      >
        <LogOut className="mr-2" /> Logout
      </button>
    </div>
  );
};

const NavItem = ({ icon, text, path }) => (
  <li>
    <Link
      to={path}
      className="flex items-center p-2 hover:bg-p-color rounded-lg transition-colors"
    >
      {icon}
      <span className="ml-2 font-text">{text}</span>
    </Link>
  </li>
);
