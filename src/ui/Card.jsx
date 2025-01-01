import React from "react";

// this is reusable card component
const Card = ({ title, children, className = "", footer, onClick }) => {
  return (
    <div
      className={`bg-white p-6 shadow-lg rounded-xl ${className}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
      <div className="mt-4">{children}</div>
      {footer && <div className="mt-4 border-t pt-4">{footer}</div>}
    </div>
  );
};

export default Card;
