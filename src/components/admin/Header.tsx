import { FC } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useSearch } from '../../context/SearchContext';

const Header: FC = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className="top-header">
      <div className="header-section">
        <h2>Dashboard Admin</h2>
      </div>
      <div className="search-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </header>
  );
};

export default Header;