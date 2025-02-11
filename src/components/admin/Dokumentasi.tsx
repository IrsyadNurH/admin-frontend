import { FC, useState, useEffect } from 'react';
import Table from './Table';
import { Column } from 'react-table';
import { useSearch } from '../../context/SearchContext';
import axios from 'axios';
import Modal from 'react-modal';

type DokumentasiData = {
  id: number;
  image: string;
  created_at?: string;
};

const DokumentasiTable: FC = () => {
  const [dokumentasi, setDokumentasi] = useState<DokumentasiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery } = useSearch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDokumentasi, setEditingDokumentasi] = useState<DokumentasiData | null>(null);
  const [editFormData, setEditFormData] = useState({
    image: null as File | null
  });

  const fetchDokumentasi = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dokumentasi`);
      setDokumentasi(response.data);
    } catch (err) {
      console.error('Error fetching dokumentasi:', err);
      setError('Failed to fetch dokumentasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDokumentasi();
  }, []);

  const handleEdit = (doc: DokumentasiData) => {
    setEditingDokumentasi(doc);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDokumentasi || !editFormData.image) return;

    try {
      const formData = new FormData();
      formData.append('image', editFormData.image);

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/dokumentasi/${editingDokumentasi.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setDokumentasi(prev => 
        prev.map(doc => 
          doc.id === editingDokumentasi.id ? response.data.dokumentasi : doc
        )
      );
      setIsEditModalOpen(false);
      alert('Dokumentasi updated successfully');
    } catch (err) {
      console.error('Error updating dokumentasi:', err);
      alert('Failed to update dokumentasi');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this dokumentasi?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/dokumentasi/${id}`);
      setDokumentasi(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      console.error('Error deleting dokumentasi:', err);
      alert('Failed to delete dokumentasi');
    }
  };

  const columns: Column<DokumentasiData>[] = [
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
          alt="Dokumentasi"
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

  const filteredData = dokumentasi.filter(doc => 
    doc.id.toString().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dokumentasi</h2>
      <Table 
        columns={columns} 
        data={filteredData}
        isDokumentasi={true}
        documentationType="dokumentasi"
      />

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <h2 className="text-2xl font-bold mb-4">Edit Dokumentasi</h2>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Image</label>
            {editingDokumentasi && (
              <img
                src={editingDokumentasi.image}
                alt="Current Dokumentasi"
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
              required
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

export default DokumentasiTable;