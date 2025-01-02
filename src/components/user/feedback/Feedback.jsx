import { useState, useEffect } from "react";
import Card from "../../../ui/Card";
import { getAuthorizationHeader, getUserData } from "../../../services/api";
import Toast from "typescript-toastify";

const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRatingChange(star)}
          className="text-2xl focus:outline-none"
        >
          {star <= rating ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
};

export const Feedback = () => {
  const [user, setUser] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthorizationHeader(),
        },
        body: JSON.stringify({
          feedback,
          rating,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        showToast("Thank you for your feedback!", "success");
        // setSuccessMessage("Thank you for your feedback!");
        setFeedback("");
        setRating(0);
      } else {
        showToast(data.message || "Failed to submit feedback");
        // setError(data.message || "Failed to submit feedback");
      }
    } catch (err) {
      showToast("An error occurred while submitting feedback");
      // setError("An error occurred while submitting feedback");
      console.error("Feedback submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-center">Please log in to submit feedback.</div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Give Your Feedback
          </h2>
          <p className="text-gray-600 mt-2">We value your opinion!</p>
        </div>

        {/* {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )} */}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>

          <div>
            <label
              htmlFor="feedback"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Feedback
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Tell us what you think..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !feedback || !rating}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default Feedback;
