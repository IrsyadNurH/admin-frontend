import React, { FC, useState, useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import ProjectTestimoni from "./ProjectTestimoni";
import ProjectTestiClient from "./ProjectTestiClient";
import KerjaSamaDev from "./KerjaSamaDev";
import LogoDevApp from "./DevelopmentApplicationLogo";
import SecurityMitra from "./SecurityMitraLogo";
import Footer from "./Footer";
import Table from './Table';
import { useSearch } from '../../context/SearchContext';
import axios from 'axios';


interface ProjectBimbleData {
  id: number;
  content_type: string;
  content: string;
}

const ProjectBimble: FC = () => {
  const [data, setData] = useState<ProjectBimbleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchQuery } = useSearch();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
  });

  const fetchData = async () => {
    try {
      const response = await api.get('/api/project-bimble');
      setData(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (item: ProjectBimbleData) => {
    const newcontent_type = prompt('Enter new content type:', item.content_type);
    const newContent = prompt('Enter new content:', item.content);
    
    if (!newcontent_type || !newContent) {
      alert('Both content type and content are required');
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/api/project-bimble/${item.id}`, {
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

  const columns: Column<ProjectBimbleData>[] = [
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
    <div className="content-grid2">
      <div className="card">
        <h2>Project</h2>
        <Table columns={columns} data={filteredData} />
      </div>
      <div className="card">
        <h2>Testimonial</h2>
        <ProjectTestimoni/>
      </div>
      <div className="card">
        <h2>Testimonial Client</h2>
        <ProjectTestiClient/>
      </div>
      <div className="card">
        <h2>Kerja Sama Development Application</h2>
        <KerjaSamaDev/>
      </div>
      <div className="card">
        <h2>Testimonial Development APP</h2>
        <LogoDevApp/>
      </div>
      <div className="card">
        <h2>Testimonial Security APP</h2>
        <SecurityMitra/>
      </div>
      <div className="card">
        <h2>Footer</h2>
        <Footer/>
      </div>
    </div>
  );
};
export default ProjectBimble;