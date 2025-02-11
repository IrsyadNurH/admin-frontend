import { FC, useState, useEffect, useMemo } from 'react';
import Table from "./Table";
import { Column } from 'react-table';
import { useSearch } from '../../context/SearchContext';
import axios from 'axios';

type KerjaSamaDevData = {
  id: number;
  content_type: string;
  content: string;
};

const KerjaSamaDevTable: FC = () => {
  const [data, setData] = useState<KerjaSamaDevData[]>([]);
  const { searchQuery } = useSearch();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<KerjaSamaDevData>>({});

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/kerjasama-dev');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row: KerjaSamaDevData) => {
    setEditData(row);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/kerjasama-dev/${editData.id}`, editData);
      setIsEditing(false);
      setEditData({});
      fetchData();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/kerjasama-dev/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };

  const columns: Column<KerjaSamaDevData>[] = [
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
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button 
            className="text-blue-500 hover:underline"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </button>
          <button 
            className="text-red-500 hover:underline"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    return data.filter(item => 
      Object.values(item).some(value => 
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, data]);

  return (
    <div>
      {isEditing ? (
        <div className="mb-4 p-4 border rounded">
          <input
            type="text"
            value={editData.content_type || ''}
            onChange={(e) => setEditData({...editData, content_type: e.target.value})}
            className="border p-2 mr-2"
            placeholder="Content Type"
          />
          <input
            type="text"
            value={editData.content || ''}
            onChange={(e) => setEditData({...editData, content: e.target.value})}
            className="border p-2 mr-2"
            placeholder="Content"
          />
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditData({});
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      ) : null}
      <Table columns={columns} data={filteredData} />
    </div>
  );
};

export default KerjaSamaDevTable;