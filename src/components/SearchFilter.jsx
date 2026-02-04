import React from 'react';
import Select from 'react-select';

const customStyles = {
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

const SearchFilter = ({
    searchTerm,
    setSearchTerm,
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    selectedConstituency,
    setSelectedConstituency,
    selectedParty,
    setSelectedParty,
    selectedAge,
    setSelectedAge,
    states,
    districts,
    constituencies,
    parties,
    ageRanges,
    onClear
}) => {
    // Convert arrays to react-select format
    const stateOptions = states.map(s => ({ value: s, label: s }));
    const districtOptions = districts.map(d => ({ value: d, label: d }));
    const constituencyOptions = constituencies.map(c => ({ value: c, label: `क्षेत्र नं. ${c}` }));
    const partyOptions = parties.map(p => ({ value: p, label: p }));
    const ageOptions = ageRanges.map(a => ({ value: a.value, label: a.label }));

    return (
        <div className="bg-surface rounded-xl shadow-md p-4 mb-6 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Search Input */}
                <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        खोज्नुहोस्
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="उम्मेदवारको नाम खोज्नुहोस्..."
                        className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-text-primary"
                    />
                </div>

                {/* State Filter */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        प्रदेश
                    </label>
                    <Select
                        value={selectedState ? { value: selectedState, label: selectedState } : null}
                        onChange={(option) => setSelectedState(option ? option.value : '')}
                        options={stateOptions}
                        isClearable
                        isSearchable
                        placeholder="सबै प्रदेश"
                        noOptionsMessage={() => "कुनै विकल्प छैन"}
                        styles={customStyles}
                    />
                </div>

                {/* District Filter */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        जिल्ला
                    </label>
                    <Select
                        value={selectedDistrict ? { value: selectedDistrict, label: selectedDistrict } : null}
                        onChange={(option) => setSelectedDistrict(option ? option.value : '')}
                        options={districtOptions}
                        isClearable
                        isSearchable
                        placeholder="सबै जिल्ला"
                        noOptionsMessage={() => "कुनै विकल्प छैन"}
                        styles={customStyles}
                    />
                </div>

                {/* Constituency Filter */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        क्षेत्र नं.
                    </label>
                    <Select
                        value={selectedConstituency ? { value: selectedConstituency, label: `क्षेत्र नं. ${selectedConstituency}` } : null}
                        onChange={(option) => setSelectedConstituency(option ? option.value : '')}
                        options={constituencyOptions}
                        isClearable
                        isSearchable
                        placeholder="सबै क्षेत्र"
                        noOptionsMessage={() => "कुनै विकल्प छैन"}
                        styles={customStyles}
                    />
                </div>

                {/* Party Filter */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        राजनीतिक दल
                    </label>
                    <Select
                        value={selectedParty ? { value: selectedParty, label: selectedParty } : null}
                        onChange={(option) => setSelectedParty(option ? option.value : '')}
                        options={partyOptions}
                        isClearable
                        isSearchable
                        placeholder="सबै दल"
                        noOptionsMessage={() => "कुनै विकल्प छैन"}
                        styles={customStyles}
                    />
                </div>

                {/* Age Filter */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        उमेर समूह
                    </label>
                    <Select
                        value={selectedAge ? ageOptions.find(a => a.value === selectedAge) : null}
                        onChange={(option) => setSelectedAge(option ? option.value : '')}
                        options={ageOptions}
                        isClearable
                        placeholder="सबै उमेर"
                        noOptionsMessage={() => "कुनै विकल्प छैन"}
                        styles={customStyles}
                    />
                </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
                <button
                    onClick={onClear}
                    className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
                >
                    फिल्टर हटाउनुहोस्
                </button>
            </div>
        </div>
    );
};

export default SearchFilter;
