import React from "react";

interface ApplyAceLogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const sizeMap = {
  small: "text-xl",
  medium: "text-3xl",
  large: "text-5xl"
};

const ApplyAceLogo: React.FC<ApplyAceLogoProps> = ({ 
  size = "medium", 
  className = "" 
}) => {
  return (
    <div className={`logo flex items-center gap-2 select-none ${className}`}>
      <span className={`logo-icon inline-block ${sizeMap[size]}`}>🎯</span>
      <span className={`logo-text font-extrabold tracking-tight font-sans bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 bg-clip-text text-transparent uppercase ${sizeMap[size]}`}
        aria-label="ApplyAce Logo"
      >
        APPLYACE
      </span>
    </div>
  );
};

export default ApplyAceLogo; 