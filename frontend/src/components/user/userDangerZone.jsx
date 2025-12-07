export default function UserDangerZone({ onDelete }) {
  const handleClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;
    onDelete();
  };

  return (
    <div className="border-t border-red-100 pt-4 mt-2">
      <h2 className="text-lg font-semibold text-red-600 mb-2">Danger zone</h2>
      <p className="text-sm text-gray-600 mb-4">
        Deleting your account will permanently remove your profile and saved
        data from UrbanGo.
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center px-4 py-2 rounded-md border border-red-600
                   text-red-600 text-sm font-medium hover:bg-red-50"
      >
        Delete account
      </button>
    </div>
  );
}
