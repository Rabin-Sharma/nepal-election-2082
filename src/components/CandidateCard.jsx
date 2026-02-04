import React, { useState } from 'react';

const CandidateCard = ({ candidate, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = `https://result.election.gov.np/Images/Candidate/${candidate.CandidateID}.jpg`;
  const fallbackImage = 'https://via.placeholder.com/150?text=No+Image';

  return (
    <div 
      className="bg-surface rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-border flex cursor-pointer hover:border-primary/50 hover:scale-[1.02]"
      onClick={() => onClick(candidate)}
    >
      {/* Image Section */}
      <div className="relative flex-shrink-0 w-36 bg-gray-100">
        <img
          src={imageError ? fallbackImage : imageUrl}
          alt={candidate.CandidateName}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 min-w-0">
        {/* Name and Party */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-text-primary truncate">
            {candidate.CandidateName}
          </h3>
          <p className="text-sm text-primary font-medium truncate">
            {candidate.PoliticalPartyName}
          </p>
        </div>

        {/* Details Grid */}
        <div className="space-y-1.5 text-sm">
          <InfoRow label="उमेर" value={`${candidate.AGE_YR} वर्ष`} />
          <InfoRow label="योग्यता" value={candidate.QUALIFICATION} />
          <InfoRow label="जिल्ला" value={candidate.DistrictName} />
          <InfoRow label="प्रदेश" value={candidate.StateName} />
          <InfoRow label="क्षेत्र" value={candidate.SCConstID} />
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-text-secondary">{label}:</span>
    <span className="text-text-primary font-medium text-right max-w-[60%] truncate">
      {value || '-'}
    </span>
  </div>
);

export default CandidateCard;
