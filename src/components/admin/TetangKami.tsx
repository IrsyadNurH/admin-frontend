import React, { FC, useState, useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import Table from './Table';
import { useSearch } from '../../context/SearchContext';
import axios from 'axios';

interface AboutUsData {
  id: number;
  content_type: string;
  content: string;
  isEditing?: boolean;
}

const TetangKami: FC = () => {
  const [data, setData] = useState<AboutUsData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchQuery } = useSearch();
  const [editingData, setEditingData] = useState<{[key: string]: string}>({});

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const fetchData = async () => {
    try {
      const response = await api.get('/api/about-us');
      setData(response.data.sort((a: AboutUsData, b: AboutUsData) => a.id - b.id));
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (item: AboutUsData) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/api/about-us/${item.id}`, {
        content_type: editingData[`content_type_${item.id}`] || item.content_type,
        content: editingData[`content_${item.id}`] || item.content
      });

      if (response.status === 200) {
        await fetchData();
        setData(prev => prev.map(row => ({
          ...row,
          isEditing: false
        })));
        setEditingData({});
      }
    } catch (error: any) {
      console.error('Update failed:', error);
      alert(`Failed to update: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<AboutUsData>[] = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Content Type',
      accessor: 'content_type',
      Cell: ({ row }) => (
        row.original.isEditing ? (
          <input
            type="text"
            className="w-full p-1 border rounded"
            defaultValue={row.original.content_type} // Menggunakan defaultValue alih-alih value
            onBlur={(e) => setEditingData(prev => ({
              ...prev,
              [`content_type_${row.original.id}`]: e.target.value
            }))}
          />
        ) : (
          row.original.content_type
        )
      )
    },
    {
      Header: 'Content',
      accessor: 'content',
      Cell: ({ row }) => (
        row.original.isEditing ? (
          <input
            type="text"
            className="w-full p-1 border rounded"
            defaultValue={row.original.content} // Menggunakan defaultValue alih-alih value
            onBlur={(e) => setEditingData(prev => ({
              ...prev,
              [`content_${row.original.id}`]: e.target.value
            }))}
          />
        ) : (
          row.original.content
        )
      )
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        row.original.isEditing ? (
          <div className="flex gap-2">
            <button 
              onClick={() => handleEdit(row.original)}
              className="text-green-500 hover:underline"
              disabled={isLoading}
            >
              Save
            </button>
            <button 
              onClick={() => {
                setData(prev => prev.map(item => 
                  item.id === row.original.id ? { ...item, isEditing: false } : item
                ));
                setEditingData({});
              }}
              className="text-red-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button 
            onClick={() => {
              setData(prev => prev.map(item => 
                item.id === row.original.id ? { ...item, isEditing: true } : item
              ));
              setEditingData({
                [`content_type_${row.original.id}`]: row.original.content_type,
                [`content_${row.original.id}`]: row.original.content
              });
            }}
            className="text-blue-500 hover:underline"
          >
            Edit
          </button>
        )
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
        <h2>Tentang Kami</h2>
        <Table 
          columns={columns} 
          data={filteredData}
        />
      </div>
    </div>
  );
};

export default TetangKami;