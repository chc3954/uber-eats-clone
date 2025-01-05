import React from "react";

interface IButtonProps {
  disable: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({ disable, loading, actionText }) => (
  <button className="button" disabled={disable || loading}>
    {loading ? "Loading..." : actionText}
  </button>
);
