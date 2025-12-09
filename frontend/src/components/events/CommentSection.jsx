import { useEffect, useState } from "react";
import { Trash2, Flag } from "lucide-react";

import {
  getComments,
  addComment,
  deleteComment,
  reportComment,
} from "../../hooks/comments";

function CommentSection({ apiId, currentUser, isDarkMode }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [reportedComments, setReportedComments] = useState([]);
  // Load comments
  useEffect(() => {
    const load = async () => {
      const data = await getComments(apiId);
      setComments(data);
    };

    load();
  }, [apiId]);

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const data = await addComment(apiId, newComment);

    // Append comment
    if (data && data._id) {
      setComments((prev) => [...prev, data]);
      setNewComment("");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);

    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  // Report comment
  const handleReportComment = async (commentId) => {
  try {
    const data = await reportComment(commentId);

    setComments(prev =>
      prev.map(c =>
        c._id === commentId
          ? { ...c, reports: data.reports, isReported: data.isReported }
          : c
      )
    );
  } catch (err) {
    console.error(err);
  }
};


  // Format timestamp
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className="mt-8 p-6 rounded-xl shadow-md"
      style={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff" }}
    >
      <h3
        className="text-xl font-semibold mb-4"
        style={{ color: isDarkMode ? "#d1d5db" : "#111827" }}
      >
        Comments
      </h3>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={c._id}
            className="border rounded-lg p-4"
            style={{
              backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
              borderColor: isDarkMode ? "#374151" : "#ffffff",
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p
                  className="font-semibold"
                  style={{ color: isDarkMode ? "#ffffff" : "#111827" }}
                >
                  {c.user
                    ? `${c.user.firstName} ${c.user.lastName}`
                    : "Unknown user"}
                </p>
                <p style={{ color: isDarkMode ? "#d1d5db" : "#374151" }}>
                  {c.comment}
                </p>
                <p style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}>
                  {formatDate(c.createdAt)}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 ml-4">
                {/* Delete button if owner/admin/superadmin */}
                {currentUser &&
                  (["admin", "superadmin"].includes(currentUser.role?.toLowerCase()) ||
                    String(currentUser._id || currentUser.userId) ===
                      String(c.user?._id || c.user)) && (
                    <button onClick={() => handleDeleteComment(c._id)}>
                      <Trash2
                        className="w-5 h-5 hover:opacity-80"
                        style={{ color: isDarkMode ? "#ffffff" : "#111827" }}
                      />
                    </button>
                  )}

                {/* Report button */}
                <button onClick={() => handleReportComment(c._id)}>
                  <Flag
                    className="w-5 h-5 hover:opacity-80"
                    style={{
                      color: c.isReported
                        ? "red"
                        : isDarkMode
                        ? "#ffffff"
                        : "#111827",
                    }}
                  />
                </button>
                {currentUser && (currentUser.role?.toLowerCase() === "admin" || currentUser.role?.toLowerCase() === "superadmin") && (
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full bg-red-600 text-white"
                    title={`${c.reports || 0} reports`}
                  >
                    {c.reports || 0}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p
            style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}
            className="italic"
          >
            No comments yet. Be the first!
          </p>
        )}
      </div>

      {/* Add Comment */}
      {currentUser ? (
        <div className="mt-6">
          <textarea
            className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              color: isDarkMode ? "#d1d5db" : "#374151",
              backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
              borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
            }}
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          <button
            onClick={handleAddComment}
            className="mt-3 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition"
          >
            Post Comment
          </button>
        </div>
      ) : (
        <p
          style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}
          className="mt-4"
        >
          Please <span className="font-semibold">log in</span> to comment.
        </p>
      )}
    </div>
  );
}

export default CommentSection;
