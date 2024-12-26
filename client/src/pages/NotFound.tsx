import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold mb-5">Page Not Found</h2>
      <Link to="/" className="ml-2 text-green-600">
        Go back home &rarr;
      </Link>
    </div>
  );
};
