import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
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
          backgroundColor: currentPage === 1 ? '#f3f4f6' : '#ffffff',
          color: '#374151',
          border: '1px solid #d1d5db'
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) e.target.style.backgroundColor = '#f9fafb';
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) e.target.style.backgroundColor = '#ffffff';
        }}
      >
        <ChevronLeft className="w-5 h-5" style={{ color: '#374151' }} />
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className="px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: currentPage === page ? '#2563eb' : '#ffffff',
            color: currentPage === page ? '#ffffff' : '#374151',
            border: '1px solid #d1d5db'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== page) e.target.style.backgroundColor = '#f9fafb';
          }}
          onMouseLeave={(e) => {
            if (currentPage !== page) e.target.style.backgroundColor = '#ffffff';
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
          backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#ffffff',
          color: '#374151',
          border: '1px solid #d1d5db'
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) e.target.style.backgroundColor = '#f9fafb';
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) e.target.style.backgroundColor = '#ffffff';
        }}
      >
        <ChevronRight className="w-5 h-5" style={{ color: '#374151' }} />
      </button>
    </div>
  );
};

export default Pagination;