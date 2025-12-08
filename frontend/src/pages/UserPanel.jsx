import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDangerZone from "../components/user/UserDangerZone";
import UserProfileSummary from "../components/user/UserProfileSummary";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "../hooks/useUserProfile";
import { useFavorites } from "../context/favoritesContext";
import EventCard from "../components/events/EventCard";
import { AnimatePresence, motion } from "framer-motion";

export default function UserPanel({ isDarkMode }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { profile, loading, error, updateProfile, deleteProfile } =
    useUserProfile();
  const { favorites, loading: favoritesLoading } = useFavorites();

  const [activeTab, setActiveTab] = useState("update");
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const handleUpdate = async (form) => {
    try {
      setSaving(true);
      setJustSaved(false);

      await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth,
        address: {
          street: form.street,
          city: form.city,
          postalCode: form.postalCode,
        },
      });

      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await deleteProfile();
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 text-gray-800">
        <div className="flex items-center justify-center h-64">
          <span className="text-gray-500 text-sm">Loading profile…</span>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
        } text-gray-800`}
      >
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-10">
          <p className="text-red-600 text-sm mb-2">
            {error || "Profile not found."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-indigo-600 hover:underline"
          >
            Go back home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="relative z-0 max-w-4xl mx-auto px-4 pt-24 pb-52">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          {["update", "favorites"].map((tab) => (
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
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab === "update" ? "Update Profile" : "Favorites"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "update" && (
            <section
              className={`shadow-sm rounded-xl border p-4 ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "border-slate-100 text-gray-800"
              } space-y-6 mb-12`}
            >
              {/* Header + avatar */}
              <div className="flex items-center justify-between gap-4">
                <UserProfileSummary profile={profile} />
                <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Account active
                </span>
              </div>

              {/* Profile form card */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-semibold">Profile settings</h1>
                    <p className="text-sm text-gray-500">
                      Update your personal information and address.
                    </p>
                  </div>
                  {justSaved && (
                    <span className="text-xs text-emerald-600 font-medium">
                      Changes saved
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formValues = {
                        firstName: e.target.firstName.value,
                        lastName: e.target.lastName.value,
                        dateOfBirth: e.target.dateOfBirth.value,
                        street: e.target.street.value,
                        city: e.target.city.value,
                        postalCode: e.target.postalCode.value,
                      };
                      handleUpdate(formValues);
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="firstName"
                        >
                          First name
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          defaultValue={profile.firstName}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="lastName"
                        >
                          Last name
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          defaultValue={profile.lastName}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        disabled
                        defaultValue={profile.email}
                        className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="dateOfBirth"
                      >
                        Date of birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        defaultValue={
                          profile.dateOfBirth
                            ? profile.dateOfBirth.slice(0, 10)
                            : ""
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="street"
                        >
                          Street
                        </label>
                        <input
                          id="street"
                          name="street"
                          defaultValue={profile.address?.street || ""}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="city"
                        >
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          defaultValue={profile.address?.city || ""}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-40">
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="postalCode"
                      >
                        Postal code
                      </label>
                      <input
                        id="postalCode"
                        name="postalCode"
                        defaultValue={profile.address?.postalCode || ""}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      {saving && (
                        <span className="text-xs text-gray-500">
                          Saving changes…
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {saving ? "Saving…" : "Save changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <UserDangerZone onDelete={handleDelete} />
            </section>
          )}

          {activeTab === "favorites" && (
            <div>
              {favoritesLoading ? (
                <div className="col-span-full text-center py-10">
                  <p>Loading favorites…</p>
                </div>
              ) : favorites.length === 0 ? (
                <div className="col-span-full text-center py-10">
                  <p>You have no favorite events yet.</p>
                </div>
              ) : (
                <div className="max-h-[80vh] overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {favorites.map((fav) => (
                        <motion.div
                          key={fav.eventId}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.25 }}
                        >
                          <EventCard
                            event={{
                              id: fav.eventId,
                              name: fav.title,
                              description:
                                fav.description?.replace(/<[^>]+>/g, "") || "",
                              date: new Date(fav.date).toLocaleDateString(),
                              endDate: new Date(
                                fav.endDate
                              ).toLocaleDateString(),
                              image: fav.image,
                              category: fav.category,
                              location: fav.location || "TBA",
                            }}
                            isDarkMode={isDarkMode}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Global toast */}
        {justSaved && (
          <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded shadow text-sm">
            Profile updated successfully
          </div>
        )}
      </div>
    </main>
  );
}
