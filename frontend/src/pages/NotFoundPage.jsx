import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = ({ isDarkMode }) => {
  return (
    <section
      className={`flex flex-col min-h-[calc(100vh-135px)] px-4 pb-20
        ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="grow flex flex-col items-center justify-center text-center px-2 sm:px-4">
        <FaExclamationTriangle
          className="text-yellow-500 mb-4 text-5xl sm:text-6xl md:text-7xl"
        />
        <h1 className="font-bold mb-4 text-4xl sm:text-5xl md:text-6xl">
          404 Not Found
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-5 max-w-xl">
          This page does not exist
        </p>
        <Link
          to="/"
          className="text-white bg-indigo-600 hover:bg-indigo-800 rounded-xl px-4 py-2 mt-4 text-sm sm:text-base md:text-lg"
        >
          Go Back
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
