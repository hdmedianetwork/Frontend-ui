// components/DatePicker.js

import { Calendar as CalendarIcon } from "lucide-react";
import { Clock as ClockIcon } from "lucide-react";

export const DatePicker = ({ value, onChange, label }) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-lg text-gray-700">
        <CalendarIcon size={16} /> {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:border-p-color focus:ring-1 focus:ring-p-color outline-none transition-all"
        required
      />
    </div>
  );
};

// components/TimePicker.js

export const TimePicker = ({ value, onChange, label }) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-lg text-gray-700">
        <ClockIcon size={16} /> {label}
      </label>
      <div className="relative">
        <input
          type="time"
          value={value}
          onChange={onChange}
          className="mt-2 p-2 pl-8 pr-4 border border-gray-300 rounded-md w-full focus:border-p-color focus:ring-1 focus:ring-p-color outline-none transition-all"
          required
        />
        <ClockIcon size={20} className="absolute left-3 top-2 text-gray-500" />
      </div>
    </div>
  );
};
