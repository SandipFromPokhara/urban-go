export default function UserDangerZone({ onDelete }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-red-600 mb-2">Danger zone</h2>
      <p className="text-sm text-gray-600 mb-4">
        Deleting your account will permanently remove your profile and saved
        data from UrbanGo.
      </p>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center px-4 py-2 rounded-md border border-red-600 text-red-600 text-sm font-medium hover:bg-red-50"
      >
        Delete account
      </button>
    </div>
  );
}
