import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAdminStats,
  getAllUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
} from "../services/adminService";
import LoadingSpinner from "../components/LoadingSpinner";
import UserDetailsModal from "../components/admin/UserDetailsModal";
import StatsTab from "../components/admin/StatsTab";
import UsersTab from "../components/admin/UsersTab";

const AdminPanel = ({ isDarkMode }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);

  // Check if user is admin or superadmin
  useEffect(() => {
    if (!isAuthenticated || !user || (user.role !== "admin" && user.role !== "superadmin")) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      if (!stats && isAuthenticated && (user?.role === "admin" || user?.role === "superadmin")) {
        setStatsLoading(true);
        setError(null);
        try {
          const data = await getAdminStats();
          setStats(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setStatsLoading(false);
        }
      }
    };
    fetchStats();
  }, [isAuthenticated, user]);

  // Fetch users when Users tab is clicked
  useEffect(() => {
    const fetchUsers = async () => {
      if (activeTab === "users" && users.length === 0 && isAuthenticated && (user?.role === "admin" || user?.role === "superadmin")) {
        setUsersLoading(true);
        setError(null);
        try {
          const data = await getAllUsers();
          setUsers(data.users || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setUsersLoading(false);
        }
      }
    };
    fetchUsers();
  }, [activeTab, isAuthenticated, user]);

  const handleUserClick = async (userId) => {
    setUserDetailsLoading(true);
    setSelectedUser(null);
    try {
      const data = await getUserDetails(userId);
      setSelectedUser(data.user);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setUserDetailsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      alert(`Role updated successfully!\n\nNote: The user must log out and log back in for the changes to take effect.`);
    } catch (err) {
      alert(`Error updating role: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      // Remove user from local state
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      alert(`Error deleting user: ${err.message}`);
    }
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "superadmin")) {
    return null;
  }

  return (
    <div
      className={`min-h-screen pt-24 pb-12 px-4 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-slate-50"
      }`}
    >
      <UserDetailsModal 
        selectedUser={selectedUser}
        isDarkMode={isDarkMode}
        onClose={closeUserDetails}
      />

      {userDetailsLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <LoadingSpinner />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-4xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Admin Panel
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-slate-600"
            }`}
          >
            Manage users, assign roles, and view statistics
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          {["stats", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? isDarkMode
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-blue-600 border-b-2 border-blue-600"
                  : isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {error ? (
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg">
            Error: {error}
          </div>
        ) : (
          <div>
            {activeTab === "stats" && (
              statsLoading ? (
                <div className="flex flex-col justify-center items-center py-20">
                  <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                    isDarkMode ? "border-blue-400" : "border-blue-600"
                  }`}></div>
                  <p className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-slate-600"}`}>
                    Loading statistics...
                  </p>
                </div>
              ) : (
                <StatsTab stats={stats} isDarkMode={isDarkMode} />
              )
            )}
            {activeTab === "users" && (
              usersLoading ? (
                <div className="flex flex-col justify-center items-center py-20">
                  <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                    isDarkMode ? "border-blue-400" : "border-blue-600"
                  }`}></div>
                  <p className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-slate-600"}`}>
                    Loading users...
                  </p>
                </div>
              ) : (
                <UsersTab
                  users={users}
                  isDarkMode={isDarkMode}
                  onUserClick={handleUserClick}
                  onRoleChange={handleRoleChange}
                  onDeleteUser={handleDeleteUser}
                  currentUserEmail={user?.email}
                  currentUserRole={user?.role}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
