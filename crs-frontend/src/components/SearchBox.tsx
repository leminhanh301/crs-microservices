import React, { useEffect, useState } from 'react';

interface SearchBoxProps {
  onSearch: (keyword: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue.trim());
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue, onSearch]);

  return (
    <div style={{ marginBottom: 16 }}>
      <input
        type="text"
        placeholder="Tìm kiếm môn học..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ padding: 8, width: 300 }}
      />
    </div>
  );
};

export default SearchBox;
