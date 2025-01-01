import React, { useState, useEffect } from "react";
import Card from "../../../ui/Card"; // Ensure this path is correct

export const Response = () => {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchedResponses = [
      "The functionality works great!",
      "It could use some improvements in UI.",
      "Easy to use but could be faster.",
      "Love the new update, very smooth!",
    ];
    setResponses(fetchedResponses);
  }, []);

  const handleCardClick = (response) => {
    console.log("Clicked on response:", response);
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-3xl font-head text-[var(--d-color)] mb-6">
        User Feedback
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {responses.length > 0 ? (
          responses.map((response, index) => (
            <Card
              key={index}
              title={`Response ${index + 1}`}
              onClick={() => handleCardClick(response)}
            >
              <p className="text-[var(--p-color)]">{response}</p>
              <div className="text-sm text-[var(--s-color)] mt-2">
                User ID: {index + 1}
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-[var(--p-color)]">
            No responses available yet.
          </p>
        )}
      </div>
    </div>
  );
};
