import { FC, useMemo } from 'react';
import { useSearch } from '../../context/SearchContext';


const dashboardData = [
  {
    id: 1,
    title: "Pelajar/Mahasiswa",
    value: "40+",
    category: "education"
  },
  {
    id: 2,
    title: "Sekolah",
    value: "5+",
    category: "education"
  },
  {
    id: 3,
    title: "Perusahaan & Bisnis UMKM",
    value: "20+",
    category: "business"
  },
  {
    id: 4,
    title: "Organisasi",
    value: "7+",
    category: "organization"
  }
];

const DashboardContent: FC = () => {
  const { searchQuery } = useSearch();

  const filteredCards = useMemo(() => {
    if (!searchQuery) return dashboardData;
    
    return dashboardData.filter(card => 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="content-grid">
      {filteredCards.map(card => (
        <div key={card.id} className="card">
          <h3>{card.title}</h3>
          <p className="number">{card.value}</p>
        </div>
      ))}
      {filteredCards.length === 0 && (
        <div className="no-results">
          <p>No results found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;