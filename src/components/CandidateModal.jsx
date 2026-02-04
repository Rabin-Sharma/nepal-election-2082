import React, { useEffect, useState } from 'react';

const CandidateModal = ({ candidate, isOpen, onClose }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen || !candidate) return null;

  const imageUrl = `https://result.election.gov.np/Images/Candidate/${candidate.CandidateID}.jpg`;
  const fallbackImage = 'https://via.placeholder.com/200?text=No+Image';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        className="relative bg-surface rounded-2xl shadow-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-text-secondary hover:text-text-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header with Image and Basic Info */}
        <div className="flex flex-col sm:flex-row gap-6 p-6 border-b border-border">
          {/* Photo */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <img
              src={imageError ? fallbackImage : imageUrl}
              alt={candidate.CandidateName}
              onError={() => setImageError(true)}
              className="w-40 h-48 object-cover rounded-xl shadow-md border border-border"
            />
          </div>

          {/* Basic Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {candidate.CandidateName}
            </h2>
            <p className="text-lg text-primary font-semibold mb-4">
              {candidate.PoliticalPartyName}
            </p>
            
            {/* Symbol Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-4">
              <span className="text-text-secondary">चुनाव चिन्ह:</span>
              <span className="font-semibold text-text-primary">{candidate.SymbolName || '-'}</span>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
              <QuickStat label="उमेर" value={`${candidate.AGE_YR} वर्ष`} />
              <QuickStat label="लिङ्ग" value={candidate.Gender} />
              <QuickStat label="जिल्ला" value={candidate.DistrictName} />
              <QuickStat label="क्षेत्र" value={candidate.SCConstID} />
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="p-6 space-y-6">
          {/* Location Info */}
          <Section title="स्थान विवरण">
            <DetailRow label="प्रदेश" value={candidate.StateName} />
            <DetailRow label="जिल्ला" value={candidate.DistrictName} />
            <DetailRow label="निर्वाचन क्षेत्र" value={candidate.SCConstID} />
            <DetailRow label="ठेगाना" value={candidate.ADDRESS} />
            <DetailRow label="नागरिकता जिल्ला" value={candidate.CTZDIST} />
          </Section>

          {/* Education & Experience */}
          <Section title="शैक्षिक योग्यता र अनुभव">
            <DetailRow label="योग्यता" value={candidate.QUALIFICATION} />
            <DetailRow label="संस्था" value={candidate.NAMEOFINST} />
            <DetailRow label="अनुभव" value={candidate.EXPERIENCE !== '0' ? candidate.EXPERIENCE : '-'} />
          </Section>

          {/* Family Info */}
          <Section title="पारिवारिक विवरण">
            <DetailRow label="बुबाको नाम" value={candidate.FATHER_NAME} />
            <DetailRow label="पति/पत्नीको नाम" value={candidate.SPOUCE_NAME !== '-' ? candidate.SPOUCE_NAME : '-'} />
          </Section>

          {/* Other Details */}
          {candidate.OTHERDETAILS && candidate.OTHERDETAILS !== '0' && (
            <Section title="अन्य विवरण">
              <p className="text-text-primary">{candidate.OTHERDETAILS}</p>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

// Quick Stat Badge
const QuickStat = ({ label, value }) => (
  <div className="bg-primary/10 px-3 py-1.5 rounded-lg">
    <span className="text-text-secondary text-xs">{label}: </span>
    <span className="text-primary font-semibold">{value || '-'}</span>
  </div>
);

// Section Header
const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-text-primary mb-3 pb-2 border-b border-border">
      {title}
    </h3>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

// Detail Row
const DetailRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1">
    <span className="text-text-secondary text-sm">{label}:</span>
    <span className="text-text-primary font-medium sm:text-right sm:max-w-[60%]">
      {value || '-'}
    </span>
  </div>
);

export default CandidateModal;
