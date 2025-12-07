export default function UserProfileSummary({ profile }) {
  if (!profile) return null;

  const initials = `${profile.firstName?.[0] || ""}${
    profile.lastName?.[0] || ""
  }`;

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-semibold">
          {initials.toUpperCase()}
        </div>

        <button
          type="button"
          aria-label="Change profile avatar (coming soon)"
          className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xs text-gray-600 shadow cursor-default"
          disabled
        >
          ✎
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">
          {profile.firstName} {profile.lastName}
        </h1>
        <p className="text-sm text-gray-500">{profile.email}</p>
      </div>
    </div>
  );
}
