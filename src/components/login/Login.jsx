import { Link, useNavigate } from "react-router-dom";
import { Password } from "../../ui/Password";
import google from "/assets/google.png";
import { loginUser, fetchUserInfo } from "../../services/api";
import { useState } from "react";
import Toast from "typescript-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const showToast = (message, type = "error") => {
    new Toast({
      position: "top-left",
      toastMsg: message,
      autoCloseTime: 300,
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
    setError("");

    const credentials = {
      email: email.trim(),
      password: password.trim(),
    };

    try {
      const loginData = await loginUser(credentials);
      console.log(loginData);

      if (loginData.success) {
        // Verify we have the token before proceeding
        const token = sessionStorage.getItem("userAccessToken");
        if (!token) {
          showToast("Login successful but no token received");
          // throw new Error("Login successful but no token received");
          return;
        }

        const userInfo = await fetchUserInfo();
        console.log("User Info:", userInfo);
        showToast("Login successfull Redirecting...", "success");

        setTimeout(() => {
          if (userInfo.data.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        }, 1000);
      } else {
        const errorMessage =
          loginData.message || "Login failed due to unexpected error.";
        showToast(errorMessage);
        // setError(errorMessage);
      }
    } catch (err) {
      console.error("Login Error:", err);
      showToast(err.message || "Something went wrong. Please try again.");

      // setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form Section - Left Half */}
      <div className="w-full bg-bg-color flex items-center justify-center  animate-fadeIn">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="logo">
            <h1 className="text-2xl font-head text-d-color mb-6 text-center">
              AI INTERVIEW CHATBOT
            </h1>
          </div>
          <h2 className="text-2xl font-head text-d-color mb-6 text-center">
            Login
          </h2>

          {/*{error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}*/}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-sub text-d-color mb-2">Email</label>
              <input
                type="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded font-text focus:border-p-color outline-none"
                required
              />
            </div>
            <Password
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-p-color text-bg-color py-2 rounded font-text hover:bg-s-color transition-colors"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center font-text text-s-color">
            Don't have an account?{" "}
            <Link to="/register" className="text-p-color hover:text-d-color">
              Register
            </Link>
          </p>

          <div className="mt-4 flex items-center justify-center">
            <button className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <img src={google} alt="Google" className="w-6 h-6 mr-2" />
              <span>Login with Google</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Section - Right Half */}
      <div className="w-full lg:w--full bg-p-color text-bg-color flex items-center p-4 sm:p-6 lg:p-12 animate-fadeIn order-1 lg:order-2 min-h-[300px] lg:min-h-screen relative two">
        <div className=" z-10  w-full">
          <h1 className="text-4xl font-head mb-6">Welcome Back!</h1>
          <p className="font-sub text-lg mb-8">
            Practice your interview skills with our AI-powered platform. Get
            instant feedback and improve your chances of success.
          </p>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-10 h-10 font-extrabold bg-bg-color rounded-full flex items-center justify-center text-p-color mr-4 flex-shrink-0">
                1
              </div>
              <p className="text-lg">Smart AI-powered interview practice</p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 font-extrabold bg-bg-color rounded-full flex items-center justify-center text-p-color mr-4 flex-shrink-0">
                2
              </div>
              <p className="text-lg">Detailed feedback and analysis</p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 font-extrabold bg-bg-color rounded-full flex items-center justify-center text-p-color mr-4 flex-shrink-0">
                3
              </div>
              <p className="text-lg">Track your progress over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
