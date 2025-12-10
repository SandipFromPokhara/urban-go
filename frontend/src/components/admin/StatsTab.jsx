const StatsTab = ({ stats, isDarkMode }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        className={`p-6 rounded-lg shadow-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-2 ${
            isDarkMode ? "text-gray-300" : "text-slate-600"
          }`}
        >
          Total Users
        </h3>
        <p
          className={`text-4xl font-bold ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          }`}
        >
          {stats.totalUsers}
        </p>
      </div>

      <div
        className={`p-6 rounded-lg shadow-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-2 ${
            isDarkMode ? "text-gray-300" : "text-slate-600"
          }`}
        >
          Total Reviews
        </h3>
        <p
          className={`text-4xl font-bold ${
            isDarkMode ? "text-green-400" : "text-green-600"
          }`}
        >
          {stats.totalReviews}
        </p>
      </div>

      <div
        className={`p-6 rounded-lg shadow-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-2 ${
            isDarkMode ? "text-gray-300" : "text-slate-600"
          }`}
        >
          Total Events
        </h3>
        <p
          className={`text-4xl font-bold ${
            isDarkMode ? "text-purple-400" : "text-purple-600"
          }`}
        >
          {stats.totalEvents}
        </p>
      </div>

      {/* Recent Activity */}
      {stats.recentUsers && stats.recentUsers.length > 0 && (
        <div
          className={`md:col-span-3 p-6 rounded-lg shadow-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`text-xl font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Recent Users
          </h3>
          <div className="space-y-2">
            {stats.recentUsers.map((user) => (
              <div
                key={user._id}
                className={`p-3 rounded ${
                  isDarkMode ? "bg-gray-700" : "bg-slate-50"
                }`}
              >
                <p
                  className={`font-semibold ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {user.firstName} {user.lastName}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-slate-600"
                  }`}
                >
                  {user.email} - Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsTab;
