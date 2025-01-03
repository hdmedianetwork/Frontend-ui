import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Toast from "typescript-toastify";

const Forgot = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const showToast = (message, type = "default") => {
    new Toast({
      position: "top-center",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate password reset request
    try {
      // In a real scenario, you'd make an API call here to request a password reset.
      setTimeout(() => {
        setLoading(false);
        showToast("Password reset link sent to your email!", "default");
        navigate("/login"); // Redirect to login page after password reset request
      }, 1500);
    } catch (err) {
      setLoading(false);
      showToast("Failed to send reset link. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Content Section - Left Half */}
      <div className="w-full lg:w-full bg-p-color text-bg-color flex items-center relative three min-h-[300px] lg:min-h-screen">
        <div className="w-full z-10 p-4 sm:p-6 lg:p-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-head mb-4 sm:mb-6">
            Forgot Your Password?
          </h1>
          <p className="font-sub text-base sm:text-lg mb-6 sm:mb-8">
            Enter your email address and we will send you a link to reset your
            password.
          </p>
        </div>
      </div>

      {/* Form Section - Right Half */}
      <div className="w-full bg-bg-color flex items-center justify-center p-8 animate-fadeIn">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="logo flex items-center mb-2">
            <img src="/assets/logo.png" alt="" height={"45px"} width={"75px"} />
            <h1 className="text-2xl font-head text-d-color  text-center ">
              AI INTERVIEW CHATBOT
            </h1>
          </div>
          <h2 className="text-2xl font-head text-d-color mb-6 text-center">
            Forgot Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-sub text-d-color mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 border rounded font-text focus:border-p-color outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-p-color text-bg-color py-2 rounded font-text transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-s-color"
              }`}
            >
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </form>
          <p className="mt-4 text-center font-text text-s-color">
            Remembered your password?{" "}
            <Link to="/login" className="text-p-color hover:text-d-color">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
