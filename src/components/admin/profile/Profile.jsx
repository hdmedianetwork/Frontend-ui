import { useState } from "react";
import Card from "../../../ui/Card";

// Mock user data (Replace with actual data)
const mockUserData = {
  name: "John Doe",
  email: "john@example.com",
  profileImage: "/assets/profile.png",
  joinedDate: "2023-05-15",
  role: "Admin",
};

export const Profile = () => {
  const [user, setUser] = useState(mockUserData);
  const [expandedCard, setExpandedCard] = useState("actions");

  const handleCardClick = (card) => {
    setExpandedCard(expandedCard === card ? null : card);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedUser = {
      ...user,
      name: formData.get("name"),
      email: formData.get("email"),
    };
    setUser(updatedUser);
  };

  return (
    <div className="p-2 space-y-6 max-w-7xl mx-auto flex flex-col gap-2 ">
      {/* Profile Header */}
      <div className="flex items-center space-x-8">
        <img
          src={user.profileImage}
          alt="Profile"
          className="h-20 w-20 rounded-full object-cover shadow-lg"
        />
        <div>
          <h2 className="text-2xl font-bold text-d-color">{user.name}</h2>
          <p className="text-lg text-gray-600">{user.email}</p>
          <p className="text-lg text-gray-600">{user.role}</p>
          <p className="text-sm text-gray-400">Joined: {user.joinedDate}</p>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card title="Your Information" onClick={() => handleCardClick("info")}>
          <ul className="text-lg text-gray-700 space-y-2">
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
            <li>Role: {user.role}</li>
            <li>Joined: {user.joinedDate}</li>
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

        {/* Actions Section */}
        <Card title="Actions" onClick={() => handleCardClick("actions")}>
          <ul className="text-lg text-gray-700 space-y-2">
            <li>Manage Subscriptions</li>
            <li>Log Out</li>
          </ul>
        </Card>
      </div>

      {/* Expanded Info Card */}
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
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label htmlFor="name" className="text-lg text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={user.name}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-lg text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={user.email}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
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

      {/* Expanded Actions Card */}
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
                onClick={() => alert("Logging Out")}
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
