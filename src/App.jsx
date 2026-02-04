import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import SearchFilter from './components/SearchFilter';
import CandidateList from './components/CandidateList';
import Dashboard from './components/Dashboard';
import { Analytics } from "@vercel/analytics/react"

const ITEMS_PER_PAGE = 12;

const AGE_RANGES = [
  { value: '25-30', label: '२५-३० वर्ष', min: 25, max: 30 },
  { value: '30-35', label: '३०-३५ वर्ष', min: 30, max: 35 },
  { value: '35-40', label: '३५-४० वर्ष', min: 35, max: 40 },
  { value: '40-45', label: '४०-४५ वर्ष', min: 40, max: 45 },
  { value: '45-50', label: '४५-५० वर्ष', min: 45, max: 50 },
  { value: '50-55', label: '५०-५५ वर्ष', min: 50, max: 55 },
  { value: '55-60', label: '५५-६० वर्ष', min: 55, max: 60 },
  { value: '60-65', label: '६०-६५ वर्ष', min: 60, max: 65 },
  { value: '65-70', label: '६५-७० वर्ष', min: 65, max: 70 },
  { value: '70-75', label: '७०-७५ वर्ष', min: 70, max: 75 },
  { value: '75-80', label: '७५-८० वर्ष', min: 75, max: 80 },
  { value: '80+', label: '८०+ वर्ष', min: 80, max: 999 },
];

const App = () => {
  const location = useLocation();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch candidates data
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('/json/candidates.json');
        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    const states = [...new Set(candidates.map(c => c.StateName))].filter(Boolean).sort();
    const parties = [...new Set(candidates.map(c => c.PoliticalPartyName))].filter(Boolean).sort();
    
    return { states, parties };
  }, [candidates]);

  // Get districts based on selected state (dependent dropdown)
  const availableDistricts = useMemo(() => {
    if (selectedState) {
      return [...new Set(
        candidates
          .filter(c => c.StateName === selectedState)
          .map(c => c.DistrictName)
      )].filter(Boolean).sort();
    }
    return [...new Set(candidates.map(c => c.DistrictName))].filter(Boolean).sort();
  }, [candidates, selectedState]);

  // Reset district when state changes
  useEffect(() => {
    if (selectedState && selectedDistrict) {
      // Check if current district exists in new state
      const districtExistsInState = candidates.some(
        c => c.StateName === selectedState && c.DistrictName === selectedDistrict
      );
      if (!districtExistsInState) {
        setSelectedDistrict('');
        setSelectedConstituency('');
      }
    }
  }, [selectedState, candidates]);

  // Get constituencies based on selected district (dependent dropdown)
  const availableConstituencies = useMemo(() => {
    let filtered = candidates;
    
    if (selectedState) {
      filtered = filtered.filter(c => c.StateName === selectedState);
    }
    if (selectedDistrict) {
      filtered = filtered.filter(c => c.DistrictName === selectedDistrict);
    }
    
    return [...new Set(filtered.map(c => c.SCConstID))]
      .filter(Boolean)
      .sort((a, b) => a - b);
  }, [candidates, selectedState, selectedDistrict]);

  // Reset constituency when district changes
  useEffect(() => {
    if (selectedDistrict && selectedConstituency) {
      const constituencyExists = candidates.some(
        c => c.DistrictName === selectedDistrict && c.SCConstID === selectedConstituency
      );
      if (!constituencyExists) {
        setSelectedConstituency('');
      }
    }
  }, [selectedDistrict, candidates]);

  // Filter candidates based on search and filters
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = searchTerm === '' || 
        candidate.CandidateName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesState = selectedState === '' || candidate.StateName === selectedState;
      const matchesDistrict = selectedDistrict === '' || candidate.DistrictName === selectedDistrict;
      const matchesConstituency = selectedConstituency === '' || candidate.SCConstID === selectedConstituency;
      const matchesParty = selectedParty === '' || candidate.PoliticalPartyName === selectedParty;
      
      let matchesAge = true;
      if (selectedAge) {
        const ageRange = AGE_RANGES.find(r => r.value === selectedAge);
        if (ageRange) {
          matchesAge = candidate.AGE_YR >= ageRange.min && candidate.AGE_YR <= ageRange.max;
        }
      }

      return matchesSearch && matchesState && matchesDistrict && matchesConstituency && matchesParty && matchesAge;
    });
  }, [candidates, searchTerm, selectedState, selectedDistrict, selectedConstituency, selectedParty, selectedAge]);

  // Paginate filtered results
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCandidates, currentPage]);

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedState, selectedDistrict, selectedConstituency, selectedParty, selectedAge]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedConstituency('');
    setSelectedParty('');
    setSelectedAge('');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        totalCandidates={candidates.length} 
        filteredCount={filteredCandidates.length}
        currentPath={location.pathname}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={
            <>
              <SearchFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                selectedConstituency={selectedConstituency}
                setSelectedConstituency={setSelectedConstituency}
                selectedParty={selectedParty}
                setSelectedParty={setSelectedParty}
                selectedAge={selectedAge}
                setSelectedAge={setSelectedAge}
                states={filterOptions.states}
                districts={availableDistricts}
                constituencies={availableConstituencies}
                parties={filterOptions.parties}
                ageRanges={AGE_RANGES}
                onClear={handleClearFilters}
              />
              <CandidateList
                candidates={paginatedCandidates}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          } />
          <Route path="/dashboard" element={
            <Dashboard candidates={candidates} />
          } />
        </Routes>
      </main>
      <Analytics />
    </div>
  );
};

export default App;