import { useState, useEffect } from 'react';
import Table from "./Table";
import { Column } from 'react-table';
import Modal from 'react-modal';

type ProjectTestiClientData = {
  id: number;
  image: string;
  name: string;
  company: string;
  testimonial: string;
  created_at: string;
};

const ProjectTestiClientTable = () => {
  const [projectTestiClients, setProjectTestiClients] = useState<ProjectTestiClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProjectTestiClient, setEditingProjectTestiClient] = useState<ProjectTestiClientData | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    company: '',
    testimonial: '',
    image: null as File | null
  });

  const fetchProjectTestiClients = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project-testi-client`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project client testimonials');
      }

      const data = await response.json();
      const sortedData = data.sort((a: ProjectTestiClientData, b: ProjectTestiClientData) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setProjectTestiClients(sortedData);
    } catch (err) {
      console.error('Error fetching project client testimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to load project client testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectTestiClients();
  }, []);

  const handleEdit = async (id: number) => {
    try {
      const projectTestiClient = projectTestiClients.find(t => t.id === id);
      if (!projectTestiClient) throw new Error('Project client testimonial not found');

      setEditingProjectTestiClient(projectTestiClient);
      setEditFormData({
        name: projectTestiClient.name,
        company: projectTestiClient.company,
        testimonial: projectTestiClient.testimonial,
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
    if (!editingProjectTestiClient) return;

    try {
      const formData = new FormData();
      formData.append('name', editFormData.name);
      formData.append('company', editFormData.company);
      formData.append('testimonial', editFormData.testimonial);
      if (editFormData.image) {
        formData.append('image', editFormData.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/project-testi-client/${editingProjectTestiClient.id}`,
        {
        method: 'PUT',
        credentials: 'include',
        body: formData
      }
    );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update project client testimonial');
      }

      setProjectTestiClients(prev => 
        prev.map(t => t.id === editingProjectTestiClient.id ? responseData.testimonial : t)
      );
      setIsEditModalOpen(false);
      await fetchProjectTestiClients();
    } catch (err) {
      console.error('Error updating project client testimonial:', err);
      alert(err instanceof Error ? err.message : 'Failed to update project client testimonial');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project client testimonial?')) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/project-testi-client/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project client testimonial');
      }

      setProjectTestiClients(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting project client testimonial:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete project client testimonial');
    }
  };

  const projectTestiClientColumns: Column<ProjectTestiClientData>[] = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Image",
      accessor: "image",
      Cell: ({ value }) => {
        const [showModal, setShowModal] = useState(false);
  
        return (
          <>
            <div className="relative w-16 h-16" onClick={() => setShowModal(true)}>
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={value}
                  alt="Testimonial"
                  className="w-full h-full object-cover cursor-pointer"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 rounded-full hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  <span className="text-white text-xs text-center px-1">View Image</span>
                </div>
              </div>
            </div>
            
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                <div className="relative">
                  <img
                    src={value}
                    alt="Testimonial Large"
                    className="w-[400px] max-h-[80vh] object-contain"
                  />
                  <button
                    className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full w-8 h-8"
                    onClick={() => setShowModal(false)}
                  >
                  x
                  </button>
                </div>
              </div>
            )}
          </>
        );
      },
    },
    {
      Header: "Company",
      accessor: "company"
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
    <div >
      
      
      <Table 
        columns={projectTestiClientColumns} 
        data={projectTestiClients} 
        isProjectTestiClient={true} // Changed from isTestimonial to isProjectTestiClient
      />
  
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <h2 className="text-2xl font-bold mb-6">Edit Project Client Testimonial</h2>
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
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={editFormData.company}
              onChange={(e) => setEditFormData(prev => ({ ...prev, company: e.target.value }))}
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
export default ProjectTestiClientTable;