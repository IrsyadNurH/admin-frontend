import React, { FC, useState, useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import Table from './Table';
import { useSearch } from '../../context/SearchContext';
import axios from 'axios';

interface KontakKamiData {
  id: number;
  content_type: string;
  content: string;
}

const KontakKami: FC = () => {
  const [data, setData] = useState<KontakKamiData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchQuery } = useSearch();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const fetchData = async () => {
    try {
      const response = await api.get('/api/kontak-kami');
      setData(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (item: KontakKamiData) => {
    const newContentType = prompt('Enter new content type:', item.content_type);
    const newContent = prompt('Enter new content:', item.content);
    
    if (!newContentType || !newContent) {
      alert('Both content type and content are required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put(`/api/kontak-kami/${item.id}`, {
        content_type: newContentType,
        content: newContent
      });

      if (response.status === 200) {
        await fetchData();
      }
    } catch (error: any) {
      console.error('Update failed:', error);
      alert(`Failed to update: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<KontakKamiData>[] = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Content Type',
      accessor: 'content_type',
    },
    {
      Header: 'Content',
      accessor: 'content',
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <button 
          onClick={() => handleEdit(row.original)}
          className="text-blue-500 hover:underline"
        >
          Edit
        </button>
      ),
    }
  ];

  const filteredData = useMemo(() => {
    return data.filter(item => 
      Object.values(item).some(value => 
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, data]);

  return (
    <div className="content-grid">
      <div className="card">
        <h2>Kontak Kami</h2>
        <Table 
          columns={columns} 
          data={filteredData}
        />
      </div>
    </div>
  );
};

export default KontakKami;