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
  const { isAuthenticated, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { profile, loading, error, updateProfile, deleteProfile } =
    useUserProfile();
  const { favorites, loading: favoritesLoading } = useFavorites();

  const [activeTab, setActiveTab] = useState("update");
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = (form) => {
    const errors = {};
    
    // Validate first name - should not be empty and contain letters
    if (!form.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (!/^[a-zA-Z\s\-']+$/.test(form.firstName)) {
      errors.firstName = "First name should only contain letters";
    }

    // Validate last name - should not be empty and contain letters
    if (!form.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (!/^[a-zA-Z\s\-']+$/.test(form.lastName)) {
      errors.lastName = "Last name should only contain letters";
    }

    // Validate date of birth - should not be in the future
    if (form.dateOfBirth) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(form.dateOfBirth);
      
      if (selectedDate > today) {
        errors.dateOfBirth = "Date of birth cannot be in the future";
      }
      
      // Check if user is at least 13 years old
      const minAge = new Date();
      minAge.setFullYear(minAge.getFullYear() - 13);
      if (selectedDate > minAge) {
        errors.dateOfBirth = "You must be at least 13 years old";
      }
    }

    // Validate street - should contain both letters and numbers
    if (form.street.trim()) {
      if (!/[a-zA-Z]/.test(form.street)) {
        errors.street = "Street address must contain letters, not just numbers";
      } else if (form.street.length < 3) {
        errors.street = "Street address is too short";
      }
    }

    // Validate city - should only contain letters
    if (form.city.trim()) {
      if (!/^[a-zA-Z\s\-']+$/.test(form.city)) {
        errors.city = "City should only contain letters";
      } else if (form.city.length < 2) {
        errors.city = "City name is too short";
      }
    }

    // Validate postal code - should be 5 digits (Finnish postal code format)
    if (form.postalCode.trim()) {
      if (!/^\d{5}$/.test(form.postalCode)) {
        errors.postalCode = "Postal code must be exactly 5 digits";
      }
    }

    return errors;
  };

  const handleUpdate = async (form) => {
    try {
      // Validate form
      const errors = validateForm(form);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      setSaving(true);
      setJustSaved(false);
      setValidationErrors({});

      const updatedProfile = await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth,
        address: {
          street: form.street,
          city: form.city,
          postalCode: form.postalCode,
        },
      });

      // Update user data in AuthContext to sync with Header
      updateUser({
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
      });

      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    } catch (err) {
      setValidationErrors({ 
        submit: err.response?.data?.message || "Failed to update profile" 
      });
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

  if (!isAuthenticated) {
    navigate("/login");
    return null;
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
                          className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                            validationErrors.firstName
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-indigo-500"
                          }`}
                        />
                        {validationErrors.firstName && (
                          <p className="text-red-600 text-xs mt-1">
                            {validationErrors.firstName}
                          </p>
                        )}
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
                          className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                            validationErrors.lastName
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-indigo-500"
                          }`}
                        />
                        {validationErrors.lastName && (
                          <p className="text-red-600 text-xs mt-1">
                            {validationErrors.lastName}
                          </p>
                        )}
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
                        max={new Date().toISOString().split('T')[0]}
                        defaultValue={
                          profile.dateOfBirth
                            ? profile.dateOfBirth.slice(0, 10)
                            : ""
                        }
                        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                          validationErrors.dateOfBirth
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-indigo-500"
                        }`}
                      />
                      {validationErrors.dateOfBirth && (
                        <p className="text-red-600 text-xs mt-1">
                          {validationErrors.dateOfBirth}
                        </p>
                      )}
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
                          placeholder="e.g., Kilonportti 1 A"
                          defaultValue={profile.address?.street || ""}
                          className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                            validationErrors.street
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-indigo-500"
                          }`}
                        />
                        {validationErrors.street && (
                          <p className="text-red-600 text-xs mt-1">
                            {validationErrors.street}
                          </p>
                        )}
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
                          placeholder="e.g., Espoo"
                          defaultValue={profile.address?.city || ""}
                          className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                            validationErrors.city
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-indigo-500"
                          }`}
                        />
                        {validationErrors.city && (
                          <p className="text-red-600 text-xs mt-1">
                            {validationErrors.city}
                          </p>
                        )}
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
                        placeholder="e.g., 02610"
                        maxLength="5"
                        defaultValue={profile.address?.postalCode || ""}
                        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                          validationErrors.postalCode
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-indigo-500"
                        }`}
                      />
                      {validationErrors.postalCode && (
                        <p className="text-red-600 text-xs mt-1">
                          {validationErrors.postalCode}
                        </p>
                      )}
                    </div>
                    {validationErrors.submit && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-red-600 text-sm">
                          {validationErrors.submit}
                        </p>
                      </div>
                    )}
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
                              date: fav.date,
                              endDate: fav.endDate,
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
