import { Link, useNavigate } from "react-router-dom";
import { Password } from "../../ui/Password";
import { useState } from "react";
import { createUser, fetchUserInfo } from "../../services/api";
import Toast from "typescript-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    profile_path: "",
    status: "active",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Password validation
    const trimmedPassword = formData.password.trim();
    if (!trimmedPassword || trimmedPassword.length < 8) {
      showToast("Password must be at least 8 characters long", "warning");
      // setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const registrationData = await createUser(formData);
      console.log("Registration successful:", registrationData);
      showToast("Registration successful Redirecting...", "success");

      if (registrationData.success) {
        try {
          const userInfo = await fetchUserInfo();
          console.log("User info fetched:", userInfo);

          setTimeout(() => {
            if (userInfo.data.role === "admin") {
              navigate("/admin/dashboard");
            } else {
              navigate("/user/dashboard");
            }
          }, 1000);
          // Redirect based on role
        } catch (userInfoError) {
          console.error("Error fetching user info:", userInfoError);
          showToast(
            userInfoError.message || "Something went wrong. Please try again."
          );
          navigate("/login");
        }
      } else {
        throw new Error(registrationData.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      // Handle specific error messages
      if (err.message.includes("Validation")) {
        // setError("Please check your input fields and try again.");
        showToast("Please check your input fields and try again.");
      } else if (err.message.includes("Network")) {
        // setError("Network error. Please check your connection and try again.");
        showToast("Network error. Please check your connection and try again.");
      } else {
        // setError(err.message || "Registration failed. Please try again.");
        showToast(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Content Section - Left Half */}
      <div className="w-full lg:w-full bg-p-color text-bg-color flex items-center relative one min-h-[300px] lg:min-h-screen">
        <div className="w-full z-10 p-4 sm:p-6 lg:p-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-head mb-4 sm:mb-6">
            Start Your Journey
          </h1>
          <p className="font-sub text-base sm:text-lg mb-6 sm:mb-8">
            Join thousands of job seekers who have improved their interview
            skills with our AI interview platform.
          </p>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 font-extrabold bg-bg-color rounded-full flex items-center justify-center text-p-color mr-3 sm:mr-4 flex-shrink-0">
                1
              </div>
              <p className="text-base sm:text-lg">
                Practice with industry-specific questions
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 font-extrabold bg-bg-color rounded-full flex items-center justify-center text-p-color mr-3 sm:mr-4 flex-shrink-0">
                2
              </div>
              <p className="text-base sm:text-lg">Get personalized feedback</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 font-extrabold bg-bg-color rounded-full flex items-center justify-center text-p-color mr-3 sm:mr-4 flex-shrink-0">
                3
              </div>
              <p className="text-base sm:text-lg">
                Access to premium interview resources
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section - Right Half */}
      <div className="w-full bg-bg-color flex items-center justify-center p-8 animate-fadeIn">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="logo">
            <h1 className="text-2xl font-head text-d-color mb-6 text-center">
              AI INTERVIEW CHATBOT
            </h1>
          </div>
          <h2 className="text-2xl font-head text-d-color mb-6 text-center">
            Register
          </h2>
          {/* {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )} */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-sub text-d-color mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full p-2 border rounded font-text focus:border-p-color outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-sub text-d-color mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-2 border rounded font-text focus:border-p-color outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-sub text-d-color mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full p-2 border rounded font-text focus:border-p-color outline-none"
                required
              />
            </div>
            <Password
              label="Password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-p-color text-bg-color py-2 rounded font-text transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-s-color"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="mt-4 text-center font-text text-s-color">
            Already have an account?{" "}
            <Link to="/login" className="text-p-color hover:text-d-color">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
