import React, { FC, useState, useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import Table from './Table';
import { useSearch } from '../../context/SearchContext';
import axios from 'axios';

interface ProjectTestimoniData {
  id: number;
  content_type: string;
  content: string;
}

const ProjectTestimoni: FC = () => {
  const [data, setData] = useState<ProjectTestimoniData[]>([]);
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
      const response = await api.get('/api/project-testimoni');
      setData(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (item: ProjectTestimoniData) => {
    const newcontent_type = prompt('Enter new content type:', item.content_type);
    const newContent = prompt('Enter new content:', item.content);
    
    if (!newcontent_type  || !newContent) {
      alert('Both content type and content are required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put(`/api/project-testimoni/${item.id}`, {
        content_type: newcontent_type ,
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

  const columns: Column<ProjectTestimoniData>[] = [
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
    <div className="card">
      <h2>Project Testimoni</h2>
      <Table 
        columns={columns} 
        data={filteredData}
      />
    </div>
  );
};

export default ProjectTestimoni;