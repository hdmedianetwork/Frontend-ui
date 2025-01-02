import { useEffect, useRef, useState } from "react";
import Card from "../../../ui/Card";
import {
  fetchUserInfo,
  getUserData,
  getAccessToken,
  logout,
  updateUserInfo,
  updateProfilePath,
} from "../../../services/api.js";
import { useNavigate } from "react-router-dom";
import Toast from "typescript-toastify";
import {
  User,
  Mail,
  Phone,
  Power,
  Edit,
  Loader,
  Lock,
  Settings,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  Camera,
} from "lucide-react";

export const Userprofile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState();
  const [expandedCard, setExpandedCard] = useState("actions"); // Track the clicked card
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

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

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check if we have an access token
        const token = getAccessToken();
        if (!token) {
          navigate("/login");
          return;
        }

        let userData = getUserData();

        if (!userData) {
          const response = await fetchUserInfo();
          if (response.success) {
            userData = response.data;
          } else {
            throw new Error("Failed to fetch user data");
          }
        }
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone_number: userData.phone_number,
          profileImage: userData.profile_path || "/assets/profile.png",
          role: userData.role || "User",
          status: userData.status || "active",
        });
        setPreviewImage(userData.profile_path || "/assets/profile.png");
      } catch (err) {
        console.error("Error loading user data:", err);
        showToast(err.message || "Failed to load user data");
        setError("Failed to load user data");

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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const filePath = file.name;

        const response = await updateProfilePath(filePath);

        if (response.success) {
          setUser((prev) => ({
            ...prev,
            profileImage: response.data.profile_path,
          }));
          setPreviewImage(response.data.profile_path);
          alert("Profile path updated successfully!");
        }
      } catch (err) {
        console.error("Error updating profile path:", err);
        alert("Failed to update profile path. Please try again.");

        setPreviewImage(user?.profileImage || "/assets/profile.png");
      }
    }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const updatedUserData = {
        // id: user.id,
        name: formData.get("name"),
        // email: user.email,
        phone_number: formData.get("phone_number"),
        // profile_path: previewImage,
        // status: user.status,
        // role: user.role,
      };

      const response = await updateUserInfo(updatedUserData);
      if (response.success) {
        setUser(response.data);
        showToast("Profile updated successfully!", "success");

        // alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast("Failed to update profile. Please try again.");
      // alert("Failed to update profile. Please try again.");
    }
  };

  const ProfileImage = ({
    imagePath,
    defaultImage = "/assets/profile.png",
    onClick,
  }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="relative group cursor-pointer" onClick={onClick}>
        <img
          src={imageError ? defaultImage : imagePath || defaultImage}
          alt="Profile"
          className="h-20 w-20 rounded-full object-cover shadow-lg transition-all duration-300 ease-in-out"
          onError={() => setImageError(true)}
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-sm font-medium">Upload Photo</span>
        </div>
      </div>
    );
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

  const handleCardClick = (card) => {
    setExpandedCard(expandedCard === card ? null : card);
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-8">
        <div className="relative">
          <ProfileImage
            imagePath={previewImage || user?.profileImage}
            defaultImage="/assets/profile.png"
            onClick={handleImageClick}
          />
          <div className="absolute bottom-0 right-0 bg-p-color p-1 rounded-full text-white cursor-pointer hover:bg-s-color transition-colors">
            <Camera size={16} />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <User className="text-p-color" size={20} />
            <h2 className="text-2xl font-bold text-d-color">{user?.name}</h2>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Mail className="text-gray-500" size={18} />
            <p className="text-lg text-gray-600">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Shield className="text-gray-500" size={18} />
            <p className="text-lg text-gray-600">
              {user?.role} ID: {user?.id}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title={
            <div className="flex items-center gap-2">
              <User className="text-p-color" size={20} />
              <span>Your Information</span>
            </div>
          }
          onClick={() => handleCardClick("info")}
          className="hover:shadow-lg transition-shadow"
        >
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-700">
              <User size={16} /> <span>{user?.name}</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <Mail size={16} /> <span>{user?.email}</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <Shield size={16} /> <span>{user?.role}</span>
            </li>
          </ul>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2">
              <Settings className="text-p-color" size={20} />
              <span>Account Settings</span>
            </div>
          }
          onClick={() => handleCardClick("account")}
          className="hover:shadow-lg transition-shadow"
        >
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-700">
              <Lock size={16} /> <span>Change Password</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <Mail size={16} /> <span>Update Email</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <Shield size={16} /> <span>Privacy Settings</span>
            </li>
          </ul>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2">
              <Settings className="text-p-color" size={20} />
              <span>Actions</span>
            </div>
          }
          onClick={() => handleCardClick("actions")}
          className="hover:shadow-lg transition-shadow"
        >
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-700">
              <CreditCard size={16} /> <span>Manage Subscriptions</span>
            </li>
            <li className="flex items-center gap-3 text-red-600">
              <LogOut size={16} /> <span>Log Out</span>
            </li>
          </ul>
        </Card>
      </div>

      {expandedCard === "info" && (
        <div className="mt-6 p-6 bg-white shadow-lg rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-p-color" size={24} />
            <h3 className="text-2xl font-semibold text-gray-800">
              Full Information
            </h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-700">
              <User size={16} /> <span>Name: {user?.name}</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <Mail size={16} /> <span>Email: {user?.email}</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <Shield size={16} /> <span>Role: {user?.role}</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <Bell size={16} /> <span>Joined: {user?.joinedDate}</span>
            </li>
          </ul>
        </div>
      )}

      {expandedCard === "account" && (
        <div className="mt-6 p-6 bg-white shadow-lg rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Edit className="text-p-color" size={24} />
            <h3 className="text-2xl font-semibold text-gray-800">
              Edit Account Settings
            </h3>
          </div>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="flex items-center gap-2 text-lg text-gray-700"
              >
                <User size={16} /> Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={user?.name}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:border-p-color focus:ring-1 focus:ring-p-color outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="phone_number"
                className="flex items-center gap-2 text-lg text-gray-700"
              >
                <Phone size={16} /> Phone Number
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                defaultValue={user?.phone_number}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:border-p-color focus:ring-1 focus:ring-p-color outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-lg text-gray-700"
              >
                <Mail size={16} /> Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                readOnly
                defaultValue={user?.email}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full bg-gray-100"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 mt-4 px-6 py-2 bg-p-color text-white rounded-md hover:bg-s-color transition-colors"
            >
              <Edit size={16} /> Save Changes
            </button>
          </form>
        </div>
      )}

      {expandedCard === "actions" && (
        <div className="mt-6 p-6 bg-white shadow-lg rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-p-color" size={24} />
            <h3 className="text-2xl font-semibold text-gray-800">
              Manage Actions
            </h3>
          </div>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => alert("Manage Subscriptions")}
                className="flex items-center gap-2 text-p-color hover:underline"
              >
                <CreditCard size={16} /> Manage Subscriptions
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:underline"
              >
                <LogOut size={16} /> Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
