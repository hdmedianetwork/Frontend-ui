import { useState, useEffect } from "react";
import { Calendar, Clock, User } from "lucide-react"; // Icons
import Card from "../../../ui/Card"; // Assuming Card is a reusable component.
import Toast from "typescript-toastify";
import { getAuthorizationHeader, getUserData } from "../../../services/api"; // Import getUserData function

export const Schedule = () => {
  const [name, setName] = useState(""); // Initialize as empty
  const [email, setEmail] = useState(""); // Initialize as empty
  const [date, setDate] = useState("");
  const [time, setTime] = useState("14:00");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Fetch user data from getUserData
        let userData = getUserData();

        // Dynamically set name and email from user data
        setName(userData.name || "");
        setEmail(userData.email || "");
      } catch (err) {
        console.error("Error loading user data:", err);
        showToast("Failed to load user data", "error");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !email || !date || !time) {
      showToast("All fields are required.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/qna/schedule-interview/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthorizationHeader(),
        },
        body: JSON.stringify({
          candidate_name: name,
          candidate_email: email,
          interview_date: date,
          interview_time: time,
        }),
      });

      if (response.ok) {
        showToast("Schedule submitted successfully!", "success");
      } else {
        const errorData = await response.json();
        showToast(
          errorData.detail || "Unexpected response from server.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error submitting schedule:", error);
      showToast("Failed to submit schedule. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Schedule Form */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <User className="text-p-color" size={20} />
            <span>Schedule an Appointment</span>
          </div>
        }
        className="hover:shadow-lg transition-shadow"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:border-p-color focus:ring-1 focus:ring-p-color outline-none transition-all"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-lg text-gray-700"
            >
              <User size={16} /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:border-p-color focus:ring-1 focus:ring-p-color outline-none transition-all"
              required
            />
          </div>

          {/* Date Input */}
          <div>
            <label
              htmlFor="date"
              className="flex items-center gap-2 text-lg text-gray-700"
            >
              <Calendar size={16} /> Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:border-p-color focus:ring-1 focus:ring-p-color outline-none transition-all"
              required
            />
          </div>

          {/* Time Input */}
          <div>
            <label
              htmlFor="time"
              className="flex items-center gap-2 text-lg text-gray-700"
            >
              <Clock size={16} /> Time
            </label>
            <div className="relative">
              <input
                type="time"
                id="time"
                name="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-2 p-2 pl-8 pr-4 border border-gray-300 rounded-md w-full focus:border-p-color focus:ring-1 focus:ring-p-color outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex items-center gap-2 mt-4 px-6 py-2 bg-p-color text-white rounded-md hover:bg-s-color transition-colors"
            disabled={loading}
          >
            {loading ? <span>Loading...</span> : <span>Submit Schedule</span>}
          </button>
        </form>
      </Card>
    </div>
  );
};
