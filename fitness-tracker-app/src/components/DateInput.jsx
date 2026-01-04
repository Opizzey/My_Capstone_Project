import React, { useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DateInput({ value, onChange, className }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selected = useMemo(() => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d) ? null : d;
  }, [value]);

  function formatYMD(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  const handleChange = (d) => {
    if (!d) { onChange(""); return; }
    onChange(formatYMD(d));
    setOpen(false);
  };
  
  useEffect(() => {
    function handleDocClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        readOnly
        value={selected ? formatYMD(selected) : ""}
        placeholder="Select date"
        onClick={() => setOpen(o => !o)}
        className={className || "border border-gray-300 rounded-lg px-3 py-2"}
      />
      {open && (
        <div className="absolute mt-2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg">
          <DatePicker
            inline
            selected={selected}
            onChange={handleChange}
            calendarClassName="z-50"
          />
        </div>
      )}
    </div>
  );
}

export default DateInput;
