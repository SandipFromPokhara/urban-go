import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, isDarkMode }) => {
  const pages = [];
  
  // Generate page numbers
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  // Don't show pagination if only 1 page
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: currentPage === 1 
            ? (isDarkMode ? '#374151' : '#f3f4f6') 
            : (isDarkMode ? '#1f2937' : '#ffffff'),
          color: isDarkMode ? '#d1d5db' : '#374151',
          border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.target.style.backgroundColor = isDarkMode ? '#374151' : '#f9fafb';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.target.style.backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
          }
        }}
      >
        <ChevronLeft className="w-5 h-5" style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} />
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className="px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: currentPage === page 
              ? '#2563eb' 
              : (isDarkMode ? '#1f2937' : '#ffffff'),
            color: currentPage === page 
              ? '#ffffff' 
              : (isDarkMode ? '#d1d5db' : '#374151'),
            border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`
          }}
          onMouseEnter={(e) => {
            if (currentPage !== page) {
              e.target.style.backgroundColor = isDarkMode ? '#374151' : '#f9fafb';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== page) {
              e.target.style.backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
            }
          }}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: currentPage === totalPages 
            ? (isDarkMode ? '#374151' : '#f3f4f6') 
            : (isDarkMode ? '#1f2937' : '#ffffff'),
          color: isDarkMode ? '#d1d5db' : '#374151',
          border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.target.style.backgroundColor = isDarkMode ? '#374151' : '#f9fafb';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            e.target.style.backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
          }
        }}
      >
        <ChevronRight className="w-5 h-5" style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} />
      </button>
    </div>
  );
};

export default Pagination;