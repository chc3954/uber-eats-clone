import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="h-[90vh] flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold mb-5">Page Not Found</h2>
      <h4 className="text-lg font-medium mb-5">
        The page you are looking for does not exist or has moved
      </h4>
      <Link to="/" className="ml-2 text-green-600 font-bold hover:underline">
        Go back home &rarr;
      </Link>
    </div>
  );
};