import { FC, useState, useEffect } from 'react';
import Table from './Table';
import { Column } from 'react-table';
import { useSearch } from '../../context/SearchContext';
import axios from 'axios';
import Modal from 'react-modal';

type DevelopmentApplicationLogoData = {
  id: number;
  image: string;
  created_at?: string;
};

const DevelopmentApplicationLogo: FC = () => {
  const [logos, setLogos] = useState<DevelopmentApplicationLogoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery } = useSearch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<DevelopmentApplicationLogoData | null>(null);
  const [editFormData, setEditFormData] = useState({
    image: null as File | null
  });

  const fetchLogos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/development-app-logos`);
      setLogos(response.data);
    } catch (err) {
      console.error('Error fetching logos:', err);
      setError('Failed to fetch logos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

const handleEdit = (logo: DevelopmentApplicationLogoData) => {
    setEditingLogo(logo);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLogo) return;

    try {
      const formData = new FormData();
      if (editFormData.image) {
        formData.append('image', editFormData.image);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/development-app-logos/${editingLogo.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setLogos(prev => 
        prev.map(logo => 
          logo.id === editingLogo.id ? response.data.logo : logo
        )
      );
      setIsEditModalOpen(false);
      alert('Logo updated successfully');
    } catch (err) {
      console.error('Error updating logo:', err);
      alert('Failed to update logo');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this logo?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/development-app-logos/${id}`);
      setLogos(prev => prev.filter(logo => logo.id !== id));
    } catch (err) {
      console.error('Error deleting logo:', err);
      alert('Failed to delete logo');
    }
  };

  const columns: Column<DevelopmentApplicationLogoData>[] = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Image",
      accessor: "image",
      Cell: ({ value }) => (
        <img
          src={value}
          alt="Development App Logo"
          className="w-20 h-16 object-cover rounded"
        />
      ),
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredData = logos.filter(logo => 
    logo.id.toString().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Development Application Logos</h2>
      <Table 
        columns={columns} 
        data={filteredData}
        isDokumentasi={true}
      />

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <h2 className="text-2xl font-bold mb-4">Edit Logo</h2>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Image</label>
            {editingLogo && (
              <img
                src={editingLogo.image}
                alt="Current Logo"
                className="w-32 h-32 object-cover rounded mt-2"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditFormData(prev => ({ 
                ...prev, 
                image: e.target.files?.[0] || null 
              }))}
              className="mt-1 block w-full"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DevelopmentApplicationLogo;