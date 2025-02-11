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

  const handleEdit = async (item: FooterData) => {
    const newcontent_type = prompt('Enter new content type:', item.content_type);
    const newContent = prompt('Enter new content:', item.content);
    
    if (!newcontent_type || !newContent) {
      alert('Both content type and content are required');
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/api/footer/${item.id}`, {
        content_type: newcontent_type,
        content: newContent
      });
      await fetchData();
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
    <>
      <Table columns={columns} data={filteredData} />
    </>
  );
};

export default Footer;