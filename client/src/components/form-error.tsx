import React from "react";

interface IFormErrorProps {
  errorMessage: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => (
  <span className="text-red-500 font-medium">{errorMessage}</span>
);
