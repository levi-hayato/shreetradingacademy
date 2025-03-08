import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
      {/* 404 Animated Text */}
      <div className="text-9xl font-extrabold text-blue-500 animate-bounce">404</div>

      {/* Error Message */}
      <h1 className="text-4xl font-bold text-gray-800 mt-4">Oops! Page Not Found</h1>
      <p className="text-gray-600 mt-2 max-w-md">
        The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      {/* Go Back Home Button */}
      <Link to="/" className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105">
        Go Back Home
      </Link>

      {/* Decorative Circles for Animation */}
      <div className="absolute top-50 left-10 w-16 h-16 bg-blue-300 rounded-full opacity-50 animate-ping"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-300 rounded-full opacity-50 animate-ping"></div>
    </div>
  );
};

export default Error;
