import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`
        w-full mx-auto px-4 sm:px-6 lg:px-8 
        md:max-w-5xl lg:max-w-6xl xl:max-w-7xl 
        ${className}
      `}
    >
      {children}
    </div>
  );
}