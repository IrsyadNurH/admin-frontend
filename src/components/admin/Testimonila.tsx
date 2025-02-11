import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from "./Table";
import { Column } from 'react-table';
import Modal from 'react-modal';

type TestimonialData = {
  id: number;
  image: string;
  name: string;
  university: string;
  testimonial: string;
  created_at: string; 
};

const TestimonialTable = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialData | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    university: '',
    testimonial: '',
    image: null as File | null
  });

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/testimonial`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }

      const data = await response.json();
      const sortedData = data.sort((a: TestimonialData, b: TestimonialData) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setTestimonials(sortedData);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleEdit = async (id: number) => {
    try {
      const testimonial = testimonials.find(t => t.id === id);
      if (!testimonial) throw new Error('Testimonial not found');

      setEditingTestimonial(testimonial);
      setEditFormData({
        name: testimonial.name,
        university: testimonial.university,
        testimonial: testimonial.testimonial,
        image: null
      });
      setIsEditModalOpen(true);
    } catch (err) {
      console.error('Error preparing edit:', err);
      alert('Failed to prepare edit form');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
  
    try {
      const formData = new FormData();
      formData.append('name', editFormData.name);
      formData.append('university', editFormData.university);
      formData.append('testimonial', editFormData.testimonial);
      if (editFormData.image) {
        formData.append('image', editFormData.image);
      }
  
      console.log('Submitting data:', {
        name: editFormData.name,
        university: editFormData.university,
        testimonial: editFormData.testimonial,
        hasImage: !!editFormData.image
      });
  
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/testimonial/${editingTestimonial.id}`,
        {
          method: 'PUT',
          credentials: 'include',
          body: formData
        }
      );
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update testimonial');
      }
  
      setTestimonials(prev => 
        prev.map(t => t.id === editingTestimonial.id ? responseData.testimonial : t)
      );
      setIsEditModalOpen(false);
      await fetchTestimonials(); // Refresh the list
    } catch (err) {
      console.error('Error updating testimonial:', err);
      alert(err instanceof Error ? err.message : 'Failed to update testimonial');
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/testimonial/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete testimonial');
      }
  
      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete testimonial');
    }
  };

  const testimonialColumns: Column<TestimonialData>[] = [
  
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Image",
      accessor: "image",
      Cell: ({ value }) => (
        <img
          src={value}
          alt="Testimonial"
          className="w-20 h-16 object-cover rounded-full"
        />
      ),
    },
    {
      Header: "University",
      accessor: "university"
    },
    {
      Header: "Testimonial",
      accessor: "testimonial",
    },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button 
            className="text-blue-500 hover:underline"
            onClick={() => handleEdit(row.original.id)}
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

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Testimonials</h2>
      
      </div>
      
      <Table 
        columns={testimonialColumns} 
        data={testimonials} 
        isTestimonial={true} 
      />

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <h2 className="text-2xl font-bold mb-6">Edit Testimonial</h2>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={editFormData.name}
              onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">University</label>
            <input
              type="text"
              value={editFormData.university}
              onChange={(e) => setEditFormData(prev => ({ ...prev, university: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Testimonial</label>
            <textarea
              value={editFormData.testimonial}
              onChange={(e) => setEditFormData(prev => ({ ...prev, testimonial: e.target.value }))}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TestimonialTable;