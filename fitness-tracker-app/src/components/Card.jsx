import React from "react";

export function Card({ className = "", children }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-3 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-base font-semibold text-gray-900 ${className}`}>{children}</h3>;
}

export function CardBody({ children, className = "" }) {
  return <div className={`${className}`}>{children}</div>;
}

export function AccentCard({ children, className = "" }) {
  return (
    <div className={`bg-white border border-gray-200 border-l-4 border-l-green-500 rounded-lg p-4 shadow-sm hover:shadow-md transition ${className}`}>
      {children}
    </div>
  );
}

export function StatCircle({ size = 128, labelTop = "", labelBottom = "", value = 0, unit = "", className = "" }) {
  const sizeClass = size >= 192 ? "w-48 h-48" : size >= 160 ? "w-40 h-40" : size >= 128 ? "w-32 h-32" : "w-28 h-28";
  return (
    <div className={`flex flex-col items-center justify-center border-2 border-green-500 rounded-full bg-white text-center ${sizeClass} ${className}`}>
      <p className="text-xs font-semibold text-gray-900">{labelTop}</p>
      <p className="text-xs text-green-500 font-semibold">{labelBottom}</p>
      <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
      {unit && <p className="text-xs text-gray-600">{unit}</p>}
    </div>
  );
}

export default Card;
