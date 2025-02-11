### Folder Structure

Here’s a suggested folder structure for your project:

```
/project-bimble
│
├── /backend
│   ├── /controllers
│   │   └── aboutUsController.ts
│   ├── /models
│   │   └── AboutUs.ts
│   ├── /routes
│   │   └── aboutUsRoutes.ts
│   ├── /config
│   │   └── db.ts
│   ├── server.ts
│   └── package.json
│
├── /frontend
│   ├── /src
│   │   ├── /components
│   │   │   ├── ProjectBimble.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── ProjectTestimoni.tsx
│   │   │   ├── ProjectTestiClient.tsx
│   │   │   ├── KerjaSamaDev.tsx
│   │   │   ├── DevelopmentApplicationLogo.tsx
│   │   │   ├── SecurityMitraLogo.tsx
│   │   │   └── Footer.tsx
│   │   ├── /context
│   │   │   └── SearchContext.tsx
│   │   ├── /hooks
│   │   │   └── useFetch.ts
│   │   ├── /services
│   │   │   └── aboutUsService.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
│
└── README.md
```

### Backend Setup

1. **Initialize the Backend**:
   - Create a new folder named `backend` and run `npm init -y` to create a `package.json` file.
   - Install necessary packages:
     ```bash
     npm install express mongoose cors body-parser
     ```

2. **Database Configuration** (`/backend/config/db.ts`):
   ```typescript
   import mongoose from 'mongoose';

   const connectDB = async () => {
     try {
       await mongoose.connect('mongodb://localhost:27017/projectbimble', {
         useNewUrlParser: true,
         useUnifiedTopology: true,
       });
       console.log('MongoDB connected');
     } catch (error) {
       console.error('MongoDB connection failed:', error);
       process.exit(1);
     }
   };

   export default connectDB;
   ```

3. **Model Definition** (`/backend/models/AboutUs.ts`):
   ```typescript
   import mongoose from 'mongoose';

   const AboutUsSchema = new mongoose.Schema({
     contentType: { type: String, required: true },
     content: { type: String, required: true },
   });

   const AboutUs = mongoose.model('AboutUs', AboutUsSchema);
   export default AboutUs;
   ```

4. **Controller Implementation** (`/backend/controllers/aboutUsController.ts`):
   ```typescript
   import { Request, Response } from 'express';
   import AboutUs from '../models/AboutUs';

   export const getAboutUs = async (req: Request, res: Response) => {
     try {
       const aboutUs = await AboutUs.find();
       res.json(aboutUs);
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   };

   export const createAboutUs = async (req: Request, res: Response) => {
     const aboutUs = new AboutUs(req.body);
     try {
       const savedAboutUs = await aboutUs.save();
       res.status(201).json(savedAboutUs);
     } catch (error) {
       res.status(400).json({ message: error.message });
     }
   };

   export const updateAboutUs = async (req: Request, res: Response) => {
     try {
       const updatedAboutUs = await AboutUs.findByIdAndUpdate(req.params.id, req.body, { new: true });
       res.json(updatedAboutUs);
     } catch (error) {
       res.status(400).json({ message: error.message });
     }
   };

   export const deleteAboutUs = async (req: Request, res: Response) => {
     try {
       await AboutUs.findByIdAndDelete(req.params.id);
       res.json({ message: 'Deleted successfully' });
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   };
   ```

5. **Routes Setup** (`/backend/routes/aboutUsRoutes.ts`):
   ```typescript
   import express from 'express';
   import { getAboutUs, createAboutUs, updateAboutUs, deleteAboutUs } from '../controllers/aboutUsController';

   const router = express.Router();

   router.get('/', getAboutUs);
   router.post('/', createAboutUs);
   router.put('/:id', updateAboutUs);
   router.delete('/:id', deleteAboutUs);

   export default router;
   ```

6. **Server Setup** (`/backend/server.ts`):
   ```typescript
   import express from 'express';
   import cors from 'cors';
   import connectDB from './config/db';
   import aboutUsRoutes from './routes/aboutUsRoutes';

   const app = express();
   const PORT = process.env.PORT || 5000;

   connectDB();

   app.use(cors());
   app.use(express.json());
   app.use('/api/aboutus', aboutUsRoutes);

   app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });
   ```

### Frontend Setup

1. **Initialize the Frontend**:
   - Create a new folder named `frontend` and run `npm init -y` to create a `package.json` file.
   - Install necessary packages:
     ```bash
     npm install react react-dom axios react-router-dom
     ```

2. **Service for API Calls** (`/frontend/src/services/aboutUsService.ts`):
   ```typescript
   import axios from 'axios';

   const API_URL = 'http://localhost:5000/api/aboutus';

   export const fetchAboutUs = async () => {
     const response = await axios.get(API_URL);
     return response.data;
   };

   export const createAboutUs = async (data: { contentType: string; content: string }) => {
     const response = await axios.post(API_URL, data);
     return response.data;
   };

   export const updateAboutUs = async (id: string, data: { contentType: string; content: string }) => {
     const response = await axios.put(`${API_URL}/${id}`, data);
     return response.data;
   };

   export const deleteAboutUs = async (id: string) => {
     await axios.delete(`${API_URL}/${id}`);
   };
   ```

3. **Update the `ProjectBimble` Component** (`/frontend/src/components/ProjectBimble.tsx`):
   ```tsx
   import { FC, useEffect, useState } from 'react';
   import { fetchAboutUs, createAboutUs, updateAboutUs, deleteAboutUs } from '../services/aboutUsService';

   const ProjectBimble: FC = () => {
     const [aboutUsData, setAboutUsData] = useState([]);
     const [newContent, setNewContent] = useState({ contentType: '', content: '' });

     useEffect(() => {
       const loadData = async () => {
         const data = await fetchAboutUs();
         setAboutUsData(data);
       };
       loadData();
     }, []);

     const handleCreate = async () => {
       const created = await createAboutUs(newContent);
       setAboutUsData([...aboutUsData, created]);
       setNewContent({ contentType: '', content: '' });
     };

     const handleUpdate = async (id: string) => {
       const updated = await updateAboutUs(id, newContent);
       setAboutUsData(aboutUsData.map(item => (item._id === id ? updated : item)));
       setNewContent({ contentType: '', content: '' });
     };

     const handleDelete = async (id: string) => {
       await deleteAboutUs(id);
       setAboutUsData(aboutUsData.filter(item => item._id !== id));
     };

     return (
       <div>
         <h1>Project Program & Bimbingan Belajar</h1>
         <input
           type="text"
           placeholder="Content Type"
           value={newContent.contentType}
           onChange={(e) => setNewContent({ ...newContent, contentType: e.target.value })}
         />
         <input
           type="text"
           placeholder="Content"
           value={newContent.content}
           onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
         />
         <button onClick={handleCreate}>Add</button>
         <ul>
           {aboutUsData.map(item => (
             <li key={item._id}>
               {item.contentType}: {item.content}
               <button onClick={() => handleUpdate(item._id)}>Update</button>
               <button onClick={() => handleDelete(item._id)}>Delete</button>
             </li>
           ))}
         </ul>
       </div>
     );
   };

   export default ProjectBimble;
   ```

### Running the Application

1. **Start the Backend**:
   - Navigate to the `backend` folder and run:
     ```bash
     ts-node server.ts
     ```

2. **Start the Frontend**:
   - Navigate to the `frontend` folder and run:
     ```bash
     npm start
     ```

### Conclusion

This setup provides a basic CRUD implementation for the `ProjectBimble` component with a backend using Express and MongoDB. You can expand upon this by adding error handling, form validation, and more complex state management as needed.