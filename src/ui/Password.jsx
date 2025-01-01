import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import PropTypes from "prop-types";

export const Password = ({ label, name, value, onChange, required }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block font-sub text-d-color mb-2">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="Enter your password"
          className="w-full p-2 border rounded font-text focus:border-p-color outline-none"
          required={required} // Set required if passed from parent
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-s-color hover:text-d-color"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
};

Password.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};
