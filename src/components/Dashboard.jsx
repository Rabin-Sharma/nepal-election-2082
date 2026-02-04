import React, { useMemo, useState } from 'react';
import Select from 'react-select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = [
  '#2563eb', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316',
  '#6366f1', '#14b8a6', '#eab308', '#dc2626', '#7c3aed'
];

const Dashboard = ({ candidates }) => {
  // State-wise distribution
  const stateData = useMemo(() => {
    const stateCount = {};
    candidates.forEach(c => {
      if (c.StateName) {
        stateCount[c.StateName] = (stateCount[c.StateName] || 0) + 1;
      }
    });
    return Object.entries(stateCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [candidates]);

  // All districts by candidate count
  const districtData = useMemo(() => {
    const districtCount = {};
    candidates.forEach(c => {
      if (c.DistrictName) {
        districtCount[c.DistrictName] = (districtCount[c.DistrictName] || 0) + 1;
      }
    });
    return Object.entries(districtCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [candidates]);

  // All political parties
  const partyData = useMemo(() => {
    const partyCount = {};
    candidates.forEach(c => {
      if (c.PoliticalPartyName) {
        partyCount[c.PoliticalPartyName] = (partyCount[c.PoliticalPartyName] || 0) + 1;
      }
    });
    return Object.entries(partyCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [candidates]);

  // Get all districts for dropdown
  const allDistricts = useMemo(() => {
    const districtCount = {};
    candidates.forEach(c => {
      if (c.DistrictName) {
        districtCount[c.DistrictName] = (districtCount[c.DistrictName] || 0) + 1;
      }
    });
    return Object.entries(districtCount)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ value: name, label: `${name} (${count})` }));
  }, [candidates]);

  // Selected district state for constituency chart
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Constituency distribution based on selected district
  const constituencyData = useMemo(() => {
    const targetCandidates = selectedDistrict 
      ? candidates.filter(c => c.DistrictName === selectedDistrict.value)
      : candidates;
    
    const constCount = {};
    targetCandidates.forEach(c => {
      if (c.SCConstID) {
        const key = `क्षेत्र ${c.SCConstID}`;
        constCount[key] = (constCount[key] || 0) + 1;
      }
    });
    return Object.entries(constCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const numA = parseInt(a.name.replace('क्षेत्र ', ''));
        const numB = parseInt(b.name.replace('क्षेत्र ', ''));
        return numA - numB;
      });
  }, [candidates, selectedDistrict]);

  // All qualification distribution
  const qualificationData = useMemo(() => {
    const qualCount = {};
    candidates.forEach(c => {
      if (c.QUALIFICATION) {
        qualCount[c.QUALIFICATION] = (qualCount[c.QUALIFICATION] || 0) + 1;
      }
    });
    return Object.entries(qualCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [candidates]);

  // Get all parties for dropdown
  const allParties = useMemo(() => {
    const partyCount = {};
    candidates.forEach(c => {
      if (c.PoliticalPartyName) {
        partyCount[c.PoliticalPartyName] = (partyCount[c.PoliticalPartyName] || 0) + 1;
      }
    });
    return Object.entries(partyCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ value: name, label: `${name} (${count})` }));
  }, [candidates]);

  // Selected party state
  const [selectedParty, setSelectedParty] = useState(null);

  // Age distribution for selected party (or all if none selected)
  const selectedPartyAgeData = useMemo(() => {
    const targetCandidates = selectedParty 
      ? candidates.filter(c => c.PoliticalPartyName === selectedParty.value)
      : candidates;
    
    const ageGroups = {
      '२५-३०': 0, '३०-३५': 0, '३५-४०': 0, '४०-४५': 0, '४५-५०': 0,
      '५०-५५': 0, '५५-६०': 0, '६०-६५': 0, '६५-७०': 0, '७०-७५': 0,
      '७५-८०': 0, '८०+': 0
    };
    
    targetCandidates.forEach(c => {
      const age = c.AGE_YR;
      if (age >= 25 && age < 30) ageGroups['२५-३०']++;
      else if (age >= 30 && age < 35) ageGroups['३०-३५']++;
      else if (age >= 35 && age < 40) ageGroups['३५-४०']++;
      else if (age >= 40 && age < 45) ageGroups['४०-४५']++;
      else if (age >= 45 && age < 50) ageGroups['४५-५०']++;
      else if (age >= 50 && age < 55) ageGroups['५०-५५']++;
      else if (age >= 55 && age < 60) ageGroups['५५-६०']++;
      else if (age >= 60 && age < 65) ageGroups['६०-६५']++;
      else if (age >= 65 && age < 70) ageGroups['६५-७०']++;
      else if (age >= 70 && age < 75) ageGroups['७०-७५']++;
      else if (age >= 75 && age < 80) ageGroups['७५-८०']++;
      else if (age >= 80) ageGroups['८०+']++;
    });

    return Object.entries(ageGroups).map(([name, value]) => ({ name, value }));
  }, [candidates, selectedParty]);

  // Gender distribution for selected party (or all if none selected)
  const selectedPartyGenderData = useMemo(() => {
    const targetCandidates = selectedParty 
      ? candidates.filter(c => c.PoliticalPartyName === selectedParty.value)
      : candidates;
    
    const genderCount = {};
    targetCandidates.forEach(c => {
      if (c.Gender) {
        genderCount[c.Gender] = (genderCount[c.Gender] || 0) + 1;
      }
    });
    return Object.entries(genderCount).map(([name, value]) => ({ name, value }));
  }, [candidates, selectedParty]);

  // Get unique genders for the legend
  const genders = useMemo(() => {
    return [...new Set(candidates.map(c => c.Gender).filter(Boolean))];
  }, [candidates]);

  // Custom styles for react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'var(--color-surface)',
      borderColor: state.isFocused ? 'var(--color-primary)' : 'var(--color-border)',
      borderRadius: '0.5rem',
      padding: '2px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none',
      '&:hover': {
        borderColor: 'var(--color-primary)',
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'var(--color-surface)',
      borderRadius: '0.5rem',
      border: '1px solid var(--color-border)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? 'var(--color-primary)'
        : state.isFocused
        ? 'rgba(37, 99, 235, 0.1)'
        : 'transparent',
      color: state.isSelected ? 'white' : 'var(--color-text-primary)',
      '&:active': {
        backgroundColor: 'var(--color-primary)',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: 'var(--color-text-primary)',
    }),
    placeholder: (base) => ({
      ...base,
      color: 'var(--color-text-secondary)',
    }),
    input: (base) => ({
      ...base,
      color: 'var(--color-text-primary)',
    }),
  };

  // Summary stats
  const stats = useMemo(() => ({
    total: candidates.length,
    states: new Set(candidates.map(c => c.StateName)).size,
    districts: new Set(candidates.map(c => c.DistrictName)).size,
    parties: new Set(candidates.map(c => c.PoliticalPartyName)).size,
    avgAge: Math.round(candidates.reduce((sum, c) => sum + (c.AGE_YR || 0), 0) / candidates.length),
  }), [candidates]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="कुल उम्मेदवार" value={stats.total} color="bg-primary" />
        <StatCard title="प्रदेश" value={stats.states} color="bg-emerald-500" />
        <StatCard title="जिल्ला" value={stats.districts} color="bg-amber-500" />
        <StatCard title="राजनीतिक दल" value={stats.parties} color="bg-purple-500" />
        <StatCard title="औसत उमेर" value={`${stats.avgAge} वर्ष`} color="bg-rose-500" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Party x Age Distribution */}
        <ChartCard title={selectedParty ? `उमेर वितरण - ${selectedParty.value}` : 'उमेर अनुसार वितरण (सबै दल)'}>
          <div className="mb-4">
            <Select
              value={selectedParty}
              onChange={setSelectedParty}
              options={allParties}
              isClearable
              isSearchable
              placeholder="राजनीतिक दल छान्नुहोस् (वा सबै हेर्नुहोस्)..."
              noOptionsMessage={() => "कुनै विकल्प छैन"}
              styles={selectStyles}
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={selectedPartyAgeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--color-text-secondary)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
                formatter={(value) => [value, 'उमेदवार संख्या']}
              />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Party x Gender Distribution */}
        <ChartCard title={selectedParty ? `लिङ्ग वितरण - ${selectedParty.value}` : 'लिङ्ग अनुसार वितरण (सबै दल)'}>
          <div className="mb-4">
            <Select
              value={selectedParty}
              onChange={setSelectedParty}
              options={allParties}
              isClearable
              isSearchable
              placeholder="राजनीतिक दल छान्नुहोस् (वा सबै हेर्नुहोस्)..."
              noOptionsMessage={() => "कुनै विकल्प छैन"}
              styles={selectStyles}
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={selectedPartyGenderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {selectedPartyGenderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
                formatter={(value) => [value, 'उमेदवार संख्या']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Constituency Distribution - Based on selected district */}
        <ChartCard title={selectedDistrict ? `निर्वाचन क्षेत्र - ${selectedDistrict.value}` : 'निर्वाचन क्षेत्र वितरण (सबै जिल्ला)'}>
          <div className="mb-4">
            <Select
              value={selectedDistrict}
              onChange={setSelectedDistrict}
              options={allDistricts}
              isClearable
              isSearchable
              placeholder="जिल्ला छान्नुहोस् (वा सबै हेर्नुहोस्)..."
              noOptionsMessage={() => "कुनै विकल्प छैन"}
              styles={selectStyles}
            />
          </div>
          {constituencyData.length > 10 ? (
            <div className="overflow-x-auto pb-2">
              <div style={{ width: `${Math.max(constituencyData.length * 50, 400)}px`, height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={constituencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
                      interval={0}
                    />
                    <YAxis tick={{ fill: 'var(--color-text-secondary)' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [value, 'उमेदवार संख्या']}
                    />
                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-text-secondary mt-2 text-center">← स्क्रोल गरेर सबै क्षेत्र हेर्नुहोस् →</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={constituencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [value, 'उमेदवार संख्या']}
                />
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* State-wise Distribution */}
        <ChartCard title="प्रदेश अनुसार वितरण">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.substring(0, 10)}... (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
                formatter={(value) => [value, 'उमेदवार संख्या']}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* All Districts - Horizontal Scrollable */}
        <div className="lg:col-span-2">
          <ChartCard title={`जिल्ला अनुसार वितरण (कुल ${districtData.length} जिल्ला)`}>
            <div className="overflow-x-auto pb-2">
              <div style={{ width: `${Math.max(districtData.length * 50, 800)}px`, height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, angle: -45, textAnchor: 'end' }}
                      height={80}
                      interval={0}
                    />
                    <YAxis tick={{ fill: 'var(--color-text-secondary)' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [value, 'उमेदवार संख्या']}
                    />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-2 text-center">← स्क्रोल गरेर सबै जिल्ला हेर्नुहोस् →</p>
          </ChartCard>
        </div>

        {/* All Political Parties - Horizontal Scrollable */}
        <div className="lg:col-span-2">
          <ChartCard title={`राजनीतिक दल अनुसार वितरण (कुल ${partyData.length} दल)`}>
            <div className="overflow-x-auto pb-2">
              <div style={{ width: `${Math.max(partyData.length * 80, 800)}px`, height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={partyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'var(--color-text-secondary)', fontSize: 9, angle: -45, textAnchor: 'end' }}
                      height={120}
                      interval={0}
                    />
                    <YAxis tick={{ fill: 'var(--color-text-secondary)' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [value, 'उमेदवार संख्या']}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-2 text-center">← स्क्रोल गरेर सबै दल हेर्नुहोस् →</p>
          </ChartCard>
        </div>

        {/* All Qualifications - Horizontal Scrollable */}
        <div className="lg:col-span-2">
          <ChartCard title={`शैक्षिक योग्यता अनुसार वितरण (कुल ${qualificationData.length} योग्यता)`}>
            <div className="overflow-x-auto pb-2">
              <div style={{ width: `${Math.max(qualificationData.length * 60, 800)}px`, height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={qualificationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, angle: -45, textAnchor: 'end' }}
                      height={100}
                      interval={0}
                    />
                    <YAxis tick={{ fill: 'var(--color-text-secondary)' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [value, 'उमेदवार संख्या']}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-2 text-center">← स्क्रोल गरेर सबै योग्यता हेर्नुहोस् →</p>
          </ChartCard>
        </div>

      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, color }) => (
  <div className="bg-surface rounded-xl shadow-md border border-border p-4">
    <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3`}>
      <span className="text-white text-lg font-bold">📊</span>
    </div>
    <p className="text-text-secondary text-sm">{title}</p>
    <p className="text-2xl font-bold text-text-primary">{value}</p>
  </div>
);

// Chart Card Component
const ChartCard = ({ title, children }) => (
  <div className="bg-surface rounded-xl shadow-md border border-border p-4">
    <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>
    {children}
  </div>
);

export default Dashboard;
