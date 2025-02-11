/project-bimble
│
├── /client                   # Frontend code (React)
│   ├── /src
│   │   ├── /components       # React components
│   │   │   ├── ProjectBimble.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── ProjectTestimoni.tsx
│   │   │   ├── ProjectTestiClient.tsx
│   │   │   ├── KerjaSamaDev.tsx
│   │   │   ├── DevelopmentApplicationLogo.tsx
│   │   │   ├── SecurityMitraLogo.tsx
│   │   │   └── Footer.tsx
│   │   ├── /context          # Context API
│   │   │   └── SearchContext.tsx
│   │   ├── /hooks            # Custom hooks
│   │   ├── /services         # API services
│   │   │   └── api.ts
│   │   ├── App.tsx           # Main app component
│   │   └── index.tsx         # Entry point
│   └── package.json          # Frontend dependencies
│
├── /server                   # Backend code (Node.js/Express)
│   ├── /models               # Database models
│   │   └── ProjectModel.js
│   ├── /routes               # API routes
│   │   └── projectRoutes.js
│   ├── /controllers          # Controllers for handling requests
│   │   └── projectController.js
│   ├── /config               # Configuration files
│   │   └── db.js
│   ├── server.js             # Entry point for the server
│   └── package.json          # Backend dependencies
│
└── README.md                 # Project documentation