# Scrum Board Application

A dynamic Scrum board application built with Vite, TypeScript, and FastAPI backend. Manage your projects with an interactive task board, resource management, and real-time updates.

## Features

- **Interactive Scrum Board**
  - Create, edit, and delete task cards
  - Customize card colors for better visualization
  - Add detailed descriptions and due dates
  - Assign team members to tasks
  - Drag-and-drop functionality between columns (Pending, Ongoing, Completed)

- **Resource Management**
  - Store project-related API endpoints
  - Save important project keys and credentials
  - Centralized location for project documentation

- **User Authentication**
  - Secure login system
  - Project-specific board access
  - User-specific task management

## Tech Stack

### Frontend
- Vite
- TypeScript
- React
- React DnD (for drag-and-drop functionality)
- Axios (for API calls)

### Backend (Hosted Separately)
- FastAPI
- MongoDB
- Python

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/scrum-board.git
cd scrum-board
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_API_URL=your_backend_url
```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5174`

## Important Notes

### Backend Connection
- The backend is hosted separately and is not included in this repository
- **Important**: The backend only accepts requests from `localhost:5174`
- When making requests to the backend, there is a ~1 minute cold start time as the server needs to hot reload
- Please wait for approximately 1 minute after your first request for the server to become responsive

### Backend Architecture
- FastAPI framework for the REST API
- MongoDB database for data persistence
- Authentication middleware for secure access
- Real-time updates using WebSocket connections

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── services/           # API service calls
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── store/              # State management
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Known Issues

- Initial backend request may timeout due to cold start
- WebSocket reconnection needed after server hot reload

## Future Improvements

- [ ] Offline support
- [ ] Real-time collaboration features
- [ ] Advanced filtering and sorting
- [ ] Custom board templates
- [ ] Activity logging and analytics

## License

This project is licensed under the MIT License - see the LICENSE file for details.
