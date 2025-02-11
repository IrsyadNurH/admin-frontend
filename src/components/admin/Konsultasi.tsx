import {FC, useMemo, useState, useEffect} from 'react';
import Table from "./Table";
import {Column} from 'react-table';
import TestimonialTable from './Testimonila';
import { useSearch } from '../../context/SearchContext';
import axios from "axios";


type KonsultasiData = {
  id: number;
  content_type: string;
  content: string;
};

const Konsultasi: FC = () => {
  const KonsultasiColumns: Column<KonsultasiData>[] = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Content Type",
      accessor: "content_type",
    },
    {
      Header: "Content",
      accessor: "content",
    },
    {
      Header: "Actions",
      Cell: ({ row }: { row: { original: KonsultasiData } }) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(row.original)}
            className="text-blue-500 hover:underline"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];
  const { searchQuery } = useSearch();
  const [data, setData] = useState<KonsultasiData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/konsultasi`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

const [, setIsLoading] = useState(false);



// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Update handleEdit function
const handleEdit = async (item: KonsultasiData) => {
  const newcontent_type = prompt('Enter new content type:', item.content_type);
  const newContent = prompt('Enter new content:', item.content);
  
  if (!newcontent_type || !newContent) {
    alert('Both content type and content are required');
    return;
  }

  setIsLoading(true);
  try {
    const response = await api.put(`/api/konsultasi/${item.id}`, {
      content_type: newcontent_type,
      content: newContent
    });

    if (response.status === 200 && response.data) {
      await fetchData();
    }
  } catch (error: any) {
    console.error('Update failed:', error);
    const message = error.response?.data?.error || 
                   error.response?.data?.message || 
                   error.message || 
                   'An unknown error occurred';
    alert(`Failed to update: ${message}`);
  } finally {
    setIsLoading(false);
  }
};

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
        <h2>Konsultasi</h2>
        <Table columns={KonsultasiColumns} data={filteredData} /><br/>
      </div>
      <div className='card'>
        <h2>Testimonial</h2>
        <TestimonialTable/>
      </div>
    </div>
  );
};

export default Konsultasi;