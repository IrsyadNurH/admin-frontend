import React, { FC, useState, useEffect, useMemo } from 'react';
import Table from "./Table";
import { Column } from 'react-table';
import { useSearch } from '../../context/SearchContext';
import axios from 'axios';

interface FooterData {
  id: number;
  content_type: string;
  content: string;
}

const Footer: FC = () => {
  const [data, setData] = useState<FooterData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<FooterData>>({});
  const { searchQuery } = useSearch();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
  });

  const fetchData = async () => {
    try {
      const response = await api.get('/api/footer');
      setData(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item: FooterData) => {
    setEditingId(item.id);
    setEditValues({
      content_type: item.content_type,
      content: item.content
    });
  };

  const handleSave = async (item: FooterData) => {
    if (!editValues.content_type || !editValues.content) {
      alert('Both content type and content are required');
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/api/footer/${item.id}`, {
        content_type: editValues.content_type,
        content: editValues.content
      });
      await fetchData();
      setEditingId(null);
      setEditValues({});
    } catch (error: any) {
      console.error('Update failed:', error);
      alert(error.response?.data?.message || 'Failed to update');
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<FooterData>[] = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Content Type',
      accessor: 'content_type',
      Cell: ({ row }) => {
        const item = row.original;
        return editingId === item.id ? (
          <input
            type="text"
            value={editValues.content_type || ''}
            onChange={(e) => setEditValues({ ...editValues, content_type: e.target.value })}
            className="w-full p-1 border rounded"
          />
        ) : (
          item.content_type
        );
      }
    },
    {
      Header: 'Content',
      accessor: 'content',
      Cell: ({ row }) => {
        const item = row.original;
        return editingId === item.id ? (
          <input
            type="text"
            value={editValues.content || ''}
            onChange={(e) => setEditValues({ ...editValues, content: e.target.value })}
            className="w-full p-1 border rounded"
          />
        ) : (
          item.content
        );
      }
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => {
        const item = row.original;
        const handleCancel = () => {
          setEditingId(null);
          setEditValues({});
        };

        return editingId === item.id ? (
          <div className="space-x-2">
            <button 
              onClick={() => handleSave(item)}
              disabled={isLoading}
              className="text-green-500 hover:underline"
            >
              Save
            </button>
            <button 
              onClick={handleCancel}
              className="text-red-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button 
            onClick={() => handleEdit(item)}
            className="text-blue-500 hover:underline"
          >
            Edit
          </button>
        );
      },
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
    <>
      <Table columns={columns} data={filteredData} />
    </>
  );
};

export default Footer;