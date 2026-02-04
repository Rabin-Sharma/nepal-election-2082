import React, { useState } from 'react';
import CandidateCard from './CandidateCard';
import CandidateModal from './CandidateModal';

const CandidateList = ({ candidates, loading, currentPage, totalPages, onPageChange }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary text-lg">कुनै उम्मेदवार भेटिएन</p>
      </div>
    );
  }

  return (
    <div>
      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {candidates.map((candidate) => (
          <CandidateCard 
            key={candidate.CandidateID} 
            candidate={candidate} 
            onClick={handleCardClick}
          />
        ))}
      </div>

      {/* Candidate Detail Modal */}
      <CandidateModal 
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            अघिल्लो
          </button>
          
          <div className="flex items-center gap-1">
            {generatePageNumbers(currentPage, totalPages).map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2 text-text-secondary">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'border border-border bg-surface text-text-primary hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            पछिल्लो
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function to generate page numbers with ellipsis
const generatePageNumbers = (current, total) => {
  const pages = [];
  const delta = 2;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    
    if (current > delta + 2) {
      pages.push('...');
    }
    
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      pages.push(i);
    }
    
    if (current < total - delta - 1) {
      pages.push('...');
    }
    
    pages.push(total);
  }

  return pages;
};

export default CandidateList;
