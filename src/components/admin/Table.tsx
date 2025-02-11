import { useTable, usePagination, useGlobalFilter, Column } from "react-table";
import { FiSearch, FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import Modal from "react-modal";
import axios from 'axios';

type DocumentationType = 'development' | 'security' | 'dokumentasi';
type TableProps<T extends object> = {
  columns: Column<T>[];
  data: T[];
  isTestimonial?: boolean;
  isProjectTestiClient?: boolean;
  isDokumentasi?: boolean;
  documentationType?: DocumentationType;

};

type TestimonialForm = {
  image_url: File | null;
  name: string;
  university: string;
  testimonial: string;
};

type ProjectTestiClientForm = {
  image_url: File | null;
  name: string;
  company: string;
  testimonial: string;
};

const Table = <T extends object>({ columns, data, isTestimonial, isProjectTestiClient, isDokumentasi ,  documentationType }: TableProps<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  
  // Form states for different types
  const [testimonialFormData, setTestimonialFormData] = useState<TestimonialForm>({
    image_url: null,
    name: '',
    university: '',
    testimonial: ''
  });

  const [projectTestiClientFormData, setProjectTestiClientFormData] = useState<ProjectTestiClientForm>({
    image_url: null,
    name: '',
    company: '',
    testimonial: ''
  });

  // Table configuration
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = useTable<T>(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    usePagination
  );

  // Handle form submissions
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isProjectTestiClient) {
        await handleProjectTestiClientSubmit(e);
      } else if (isTestimonial) {
        await handleTestimonialSubmit(e);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form');
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!testimonialFormData.image_url || !testimonialFormData.name || 
          !testimonialFormData.university || !testimonialFormData.testimonial) {
        alert('All fields are required');
        return;
      }

      const formData = new FormData();
      formData.append('image', testimonialFormData.image_url);
      formData.append('name', testimonialFormData.name);
      formData.append('university', testimonialFormData.university);
      formData.append('testimonial', testimonialFormData.testimonial);

      const response = await axios.post(
        "http://localhost:5000/api/testimonial",
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.status === 201) {
        setTestimonialFormData({
          image_url: null,
          name: '',
          university: '',
          testimonial: ''
        });
        setIsModalOpen(false);
        alert('Testimonial added successfully');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add testimonial');
    }
  };

  const handleProjectTestiClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!projectTestiClientFormData.image_url || !projectTestiClientFormData.name || 
          !projectTestiClientFormData.company || !projectTestiClientFormData.testimonial) {
        alert('All fields are required');
        return;
      }

      const formData = new FormData();
      formData.append('image', projectTestiClientFormData.image_url);
      formData.append('name', projectTestiClientFormData.name);
      formData.append('company', projectTestiClientFormData.company);
      formData.append('testimonial', projectTestiClientFormData.testimonial);

      const response = await axios.post(
        "http://localhost:5000/api/project-testi-client",
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.status === 201) {
        setProjectTestiClientFormData({
          image_url: null,
          name: '',
          company: '',
          testimonial: ''
        });
        setIsModalOpen(false);
        alert('Project Client Testimonial added successfully');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add project client testimonial');
    }
  };
  const [dokumentasiData, setDokumentasiData] = useState({
    image_url: null as File | null
  });
  
  // Handler terpisah untuk dokumentasi
  const handleDokumentasiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!dokumentasiData.image_url) {
        alert('Please select an image file');
        return;
      }
  
      const formData = new FormData();
      formData.append('image', dokumentasiData.image_url);
  
      // Select endpoint based on documentationType
      let endpoint = '';
      switch (documentationType) {
        case 'development':
          endpoint = 'development-app-logos';
          break;
        case 'security':
          endpoint = 'security-mitra-logos';
          break;
        case 'dokumentasi':
            endpoint = 'dokumentasi';
            break;
        default:
          throw new Error('Invalid document type');
      }
  
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/${endpoint}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.status === 201) {
        setDokumentasiData({ image_url: null });
        setIsModalOpen2(false);
        alert('Document added successfully');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add document');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border rounded px-4 py-2 w-full md:w-1/3"
            placeholder="Search..."          
          />
          {(isTestimonial || isProjectTestiClient) && (
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <FiPlus />
              {isProjectTestiClient ? 'Add Project Client Testimonial' : 'Add Testimonial'}
            </button>
          )}
           {isDokumentasi && (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
            onClick={() => setIsModalOpen2(true)}
          >
            <FiPlus />
            Tambah image
          </button>
        )}

        </div>
       
        
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="modal"
          overlayClassName="modal-overlay"
        >
          <div className="bg-white p-4 md:p-6 rounded-lg w-[90%] md:w-[500px] max-h-[90vh] overflow-y-auto mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              {isProjectTestiClient ? 'Add Project Client Testimonial' : 'Add Testimonial'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (isProjectTestiClient) {
                      setProjectTestiClientFormData(prev => ({ ...prev, image_url: file }));
                    } else {
                      setTestimonialFormData(prev => ({ ...prev, image_url: file }));
                    }
                  }}
                  className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={isProjectTestiClient ? projectTestiClientFormData.name : testimonialFormData.name}
                  onChange={(e) => {
                    if (isProjectTestiClient) {
                      setProjectTestiClientFormData(prev => ({ ...prev, name: e.target.value }));
                    } else {
                      setTestimonialFormData(prev => ({ ...prev, name: e.target.value }));
                    }
                  }}
                  className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  {isProjectTestiClient ? 'Company' : 'University'}
                </label>
                <input
                  type="text"
                  value={isProjectTestiClient ? projectTestiClientFormData.company : testimonialFormData.university}
                  onChange={(e) => {
                    if (isProjectTestiClient) {
                      setProjectTestiClientFormData(prev => ({ ...prev, company: e.target.value }));
                    } else {
                      setTestimonialFormData(prev => ({ ...prev, university: e.target.value }));
                    }
                  }}
                  className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Testimonial</label>
                <textarea
                  value={isProjectTestiClient ? projectTestiClientFormData.testimonial : testimonialFormData.testimonial}
                  onChange={(e) => {
                    if (isProjectTestiClient) {
                      setProjectTestiClientFormData(prev => ({ ...prev, testimonial: e.target.value }));
                    } else {
                      setTestimonialFormData(prev => ({ ...prev, testimonial: e.target.value }));
                    }
                  }}
                  className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 border rounded text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </Modal>

         {/* area form dokumentasi */}

      <Modal
        isOpen={isModalOpen2}
        onRequestClose={() => setIsModalOpen2(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="bg-white p-4 md:p-6 rounded-lg w-[90%] md:w-[500px] max-h-[90vh] overflow-y-auto mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Tambah Dokumentasi</h2>
          <form onSubmit={handleDokumentasiSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Foto Dokumentasi</label>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={(e) => setDokumentasiData({
                  image_url: e.target.files?.[0] || null
                })}
                className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen2(false)}
                className="w-full sm:w-auto px-4 py-2 border rounded text-sm hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </Modal>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-full border-collapse border border-gray-300"
        >
        <thead className="bg-gray-100">
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex} className="border">
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  {...column.getHeaderProps()}
                  key={columnIndex}
                  className="border px-4 py-2 text-left"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id} className="border hover:bg-gray-50">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id} className="border px-4 py-2 text-sm">
                    <div className="max-w-[600px] overflow-hidden whitespace-pre-line leading-relaxed line-clamp-3 hover:line-clamp-none">
                      {cell.render("Cell")}
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="mt-2 md:mt-0">
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="ml-4 border rounded px-2 py-1"
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Table;