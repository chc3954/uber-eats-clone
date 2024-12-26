import React from "react";

interface IButtonProps {
  disable: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({ disable, loading, actionText }) => (
  <button
    className="py-3 text-lg text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:opacity-50 transition-colors "
    disabled={disable || loading}>
    {loading ? "Loading..." : actionText}
  </button>
);
