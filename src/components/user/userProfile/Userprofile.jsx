import { useEffect, useRef, useState } from "react";
import Card from "../../../ui/Card";
// import profile from "/assets/profile.png";
import {
  fetchUserInfo,
  getUserData,
  getAccessToken,
  logout,
  updateUserInfo,
  updateProfilePath,
} from "../../../services/api.js";
import { useNavigate } from "react-router-dom";

export const Userprofile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState();
  const [expandedCard, setExpandedCard] = useState("actions"); // Track the clicked card
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

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
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
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
    <div className="p-2 space-y-6 max-w-7xl mx-auto flex flex-col gap-2 ">
      {/* Profile Header */}
      <div className="flex items-center space-x-8">
        <div className="relative">
          <ProfileImage
            imagePath={previewImage || user?.profileImage}
            defaultImage="/assets/profile.png"
            onClick={handleImageClick}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-d-color">{user.name}</h2>
          <p className="text-lg text-gray-600">{user.email}</p>
          <p className="text-lg text-gray-600">
            {user.role} ID: {user.id}
          </p>
          <p className="text-sm text-gray-400">Status: {user.status}</p>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card title="Your Information" onClick={() => handleCardClick("info")}>
          <ul className="text-lg text-gray-700 space-y-2">
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
            <li>Role: {user.role}</li>
            <li>Status: {user.status}</li>
          </ul>
        </Card>

        {/* Account Settings Section */}
        <Card
          title="Account Settings"
          onClick={() => handleCardClick("account")}
        >
          <ul className="text-lg text-gray-700 space-y-2">
            <li>Change Password</li>
            <li>Update Email</li>
            <li>Privacy Settings</li>
          </ul>
        </Card>

        <Card title="Actions" onClick={() => handleCardClick("actions")}>
          <ul className="text-lg text-gray-700 space-y-2">
            <li>Manage Subscriptions</li>
            <li>Log Out</li>
          </ul>
        </Card>
      </div>

      {expandedCard === "info" && (
        <div className="mt-10 p-6 bg-white shadow-lg rounded-xl">
          <h3 className="text-2xl font-semibold text-gray-800">
            Full Information
          </h3>
          <ul className="text-lg text-gray-700 space-y-2 mt-1">
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
            <li>Role: {user.role}</li>
            <li>Joined: {user.joinedDate}</li>
          </ul>
        </div>
      )}

      {expandedCard === "account" && (
        <div className="mt-10 p-6 bg-white shadow-lg rounded-xl">
          <h3 className="text-2xl font-semibold text-gray-800">
            Edit Account Settings
          </h3>
          <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-6">
            <div>
              <label htmlFor="name" className="text-lg text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={user?.name}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div>
              <label htmlFor="phone_number" className="text-lg text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                defaultValue={user?.phone_number}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-lg text-gray-700">
                Email
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
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {expandedCard === "actions" && (
        <div className="mt-10 p-6 bg-white shadow-lg rounded-xl">
          <h3 className="text-2xl font-semibold text-gray-800">
            Manage Actions
          </h3>
          <ul className="text-lg text-gray-700 space-y-2 mt-4">
            <li>
              <button
                onClick={() => alert("Manage Subscriptions")}
                className="text-p-color hover:underline"
              >
                Manage Subscriptions
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline"
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
