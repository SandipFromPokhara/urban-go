const UserDetailsModal = ({ selectedUser, isDarkMode, onClose }) => {
  if (!selectedUser) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.7) 0%, rgba(31, 41, 55, 0.7) 100%)'
          : 'linear-gradient(135deg, rgba(241, 245, 249, 0.7) 0%, rgba(226, 232, 240, 0.7) 100%)'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative max-w-3xl w-full max-h-[85vh] overflow-hidden rounded-xl shadow-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className={`relative p-6 border-b ${
          isDarkMode ? "border-gray-700" : "border-slate-200"
        }`}>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 text-2xl hover:opacity-70 transition-opacity ${
              isDarkMode ? "text-gray-400" : "text-slate-600"
            }`}
          >
            ×
          </button>
          <h2 className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}>
            {selectedUser.firstName} {selectedUser.lastName}
          </h2>
          <p className={`text-sm mt-1 ${
            isDarkMode ? "text-gray-400" : "text-slate-600"
          }`}>
            {selectedUser.email}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          <div className="space-y-4">
            {/* Role */}
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? "bg-gray-700 border-gray-600" : "bg-slate-50 border-slate-200"
            }`}>
              <p className={`text-sm font-semibold mb-1 ${
                isDarkMode ? "text-gray-400" : "text-slate-600"
              }`}>
                Role
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                selectedUser.role === "admin"
                  ? "bg-purple-500 text-white"
                  : isDarkMode
                    ? "bg-gray-600 text-gray-200"
                    : "bg-slate-200 text-slate-700"
              }`}>
                {selectedUser.role?.toUpperCase()}
              </span>
            </div>

            {/* Date of Birth */}
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? "bg-gray-700 border-gray-600" : "bg-slate-50 border-slate-200"
            }`}>
              <p className={`text-sm font-semibold mb-1 ${
                isDarkMode ? "text-gray-400" : "text-slate-600"
              }`}>
                Date of Birth
              </p>
              <p className={`text-base ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}>
                {selectedUser.dateOfBirth
                  ? new Date(selectedUser.dateOfBirth).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>

            {/* Address */}
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? "bg-gray-700 border-gray-600" : "bg-slate-50 border-slate-200"
            }`}>
              <p className={`text-sm font-semibold mb-1 ${
                isDarkMode ? "text-gray-400" : "text-slate-600"
              }`}>
                Address
              </p>
              <p className={`text-base ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}>
                {selectedUser.address?.street || "Not provided"}
              </p>
              <p className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-slate-600"
              }`}>
                {selectedUser.address?.city || ""}{" "}
                {selectedUser.address?.postalCode || ""}
              </p>
            </div>

            {/* Joined Date */}
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? "bg-gray-700 border-gray-600" : "bg-slate-50 border-slate-200"
            }`}>
              <p className={`text-sm font-semibold mb-1 ${
                isDarkMode ? "text-gray-400" : "text-slate-600"
              }`}>
                Member Since
              </p>
              <p className={`text-base ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}>
                {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-slate-500"
              }`}>
                {new Date(selectedUser.createdAt).toLocaleTimeString()}
              </p>
            </div>

            {/* Activity Stats */}
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? "bg-gray-700 border-gray-600" : "bg-slate-50 border-slate-200"
            }`}>
              <p className={`text-sm font-semibold mb-3 ${
                isDarkMode ? "text-gray-400" : "text-slate-600"
              }`}>
                Activity
              </p>
              <div className="flex gap-8">
                <div>
                  <p className={`text-xl font-bold ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}>
                    {selectedUser.comments?.length || 0}
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-slate-600"
                  }`}>
                    Comments
                  </p>
                </div>
                <div>
                  <p className={`text-xl font-bold ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}>
                    {selectedUser.favorites?.length || 0}
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-slate-600"
                  }`}>
                    Favorites
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
