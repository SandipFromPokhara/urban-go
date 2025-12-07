const UsersTab = ({ users, isDarkMode, onUserClick, onRoleChange, onDeleteUser, currentUserEmail, currentUserRole }) => {
  return (
    <div
      className={`rounded-lg shadow-lg overflow-hidden ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDarkMode ? "bg-gray-700" : "bg-slate-100"}>
            <tr>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Name
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Email
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Role
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Joined
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Comments
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-slate-700"
                }`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className={`border-b ${
                  isDarkMode ? "border-gray-700" : "border-slate-200"
                }`}
              >
                <td
                  className={`px-6 py-4 ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  <button
                    onClick={() => onUserClick(user._id)}
                    className={`font-semibold hover:underline cursor-pointer transition-colors ${
                      isDarkMode
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-700"
                    }`}
                  >
                    {user.firstName} {user.lastName}
                  </button>
                </td>
                <td
                  className={`px-6 py-4 ${
                    isDarkMode ? "text-gray-300" : "text-slate-700"
                  }`}
                >
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "superadmin"
                        ? "bg-green-500 text-white"
                        : user.role === "admin"
                          ? "bg-purple-500 text-white"
                          : isDarkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {user.role === "superadmin" ? "Super Admin" : user.role}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 ${
                    isDarkMode ? "text-gray-300" : "text-slate-700"
                  }`}
                >
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td
                  className={`px-6 py-4 ${
                    isDarkMode ? "text-gray-300" : "text-slate-700"
                  }`}
                >
                  {user.comments?.length || 0}
                </td>
                <td className="px-6 py-4">
                  {user.email === currentUserEmail ? (
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-md text-sm border ${
                        isDarkMode
                          ? "bg-gray-800 text-gray-500 border-gray-700"
                          : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}>
                        {user.role === "superadmin" ? "Super Admin (You)" : user.role === "admin" ? "Admin (You)" : "User (You)"}
                      </span>
                      <span className={`px-3 py-1 rounded-md text-sm ${
                        isDarkMode ? "text-gray-600" : "text-gray-400"
                      }`}>
                        —
                      </span>
                    </div>
                  ) : currentUserRole === "admin" && (user.role === "admin" || user.role === "superadmin") ? (
                    // Regular admin cannot modify other admins
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-md text-sm border ${
                        isDarkMode
                          ? "bg-gray-800 text-gray-500 border-gray-700"
                          : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}>
                        {user.role === "superadmin" ? "Super Admin" : "Admin"}
                      </span>
                      <span className={`px-3 py-1 rounded-md text-sm ${
                        isDarkMode ? "text-gray-600" : "text-gray-400"
                      }`}>
                        —
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => onRoleChange(user._id, e.target.value)}
                        className={`px-3 py-1 rounded-md text-sm border ${
                          isDarkMode
                            ? "bg-gray-700 text-white border-gray-600"
                            : "bg-white text-slate-900 border-slate-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete ${user.firstName} ${user.lastName}? This will also delete all their comments.`
                            )
                          ) {
                            onDeleteUser(user._id);
                          }
                        }}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          isDarkMode
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTab;
