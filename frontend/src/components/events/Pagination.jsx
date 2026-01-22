import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, isDarkMode }) => {
  // Don't show pagination if only 1 page
  if (totalPages <= 1) return null;

  // Generate smart page numbers (show first, last, current, and nearby pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7; // Show max 7 page buttons
    
    if (totalPages <= maxPagesToShow) {
      // If total pages is small, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 5;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
        endPage = totalPages - 1;
      }
      
      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
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
      {pages.map((page, index) => {
        // Render ellipsis
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2"
              style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
            >
              ...
            </span>
          );
        }
        
        // Render page button
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="px-4 py-2 rounded-lg font-medium transition-colors min-w-[40px]"
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
        );
      })}

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