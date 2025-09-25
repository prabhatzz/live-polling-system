# 📊 Live Polling System

A real-time interactive polling system designed for educational environments with separate interfaces for teachers and students.

![Live Polling System](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-orange)

## 🚀 Live Demo

**🌐 [View Live Application](https://live-polling-system-6qgb.vercel.app/)**

**🔗 Backend API**: [https://live-polling-system-production-6105.up.railway.app](https://live-polling-system-production-6105.up.railway.app)  
**🩺 Health Check**: [https://live-polling-system-production-6105.up.railway.app/health](https://live-polling-system-production-6105.up.railway.app/health)


## 📋 Features

### ��‍🏫 Teacher Features
- ✅ Create interactive polls with custom questions and options
- ✅ View live polling results with real-time updates
- ✅ Configure poll time limits (10-300 seconds)
- ✅ Remove students from sessions
- ✅ Live chat with students
- ✅ View poll history and analytics

### 👨‍🎓 Student Features
- ✅ Join sessions with unique names
- ✅ Answer polls in real-time
- ✅ View live results after submission
- ✅ Participate in live chat
- ✅ Automatic timeout handling

## 🛠️ Technology Stack

- **Frontend**: React 18, Redux Toolkit, Socket.io Client, Chart.js
- **Backend**: Node.js, Express.js, Socket.io
- **Real-time Communication**: WebSockets
- **Deployment**: GitHub Pages + Railway
- **Styling**: Custom CSS with modern design

## 🎯 Quick Start

### Prerequisites
- Node.js 16+ 
- npm 8+

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/prabhatzz/live-polling-system.git
cd live-polling-system
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Start development servers**
```bash
npm run dev
```

4. **Open your browser**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🌐 Deployment

This project is deployed using:
- **Frontend**: Vercel
- **Backend**: Railway

## �� How to Use

### For Teachers:
1. Open the live application
2. Select "Teacher" role
3. Create a new poll with your question and options
4. Set time limit (optional)
5. Share the link with students
6. View live results and chat with students

### For Students:
1. Open the live application
2. Select "Student" role
3. Enter your name to join
4. Wait for teacher to create a poll
5. Answer the poll questions
6. View results and participate in chat

## 🏗️ Project Structure

```
live-polling-system/
├── backend/                 # Node.js backend server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── node_modules/        # Backend dependencies
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # Socket.io service
│   │   ├── store/          # Redux store
│   │   └── styles/         # CSS styles
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── railway.json           # Railway deployment config
├── vercel.json           # Vercel deployment config
└── README.md             # This file
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.railway.app
```

## 🚀 Deployment Steps

### 1. Railway (Backend)
1. Connect GitHub repo to Railway
2. Set environment variables
3. Deploy automatically

### 2. Vercel/Netlify (Frontend)
1. Connect GitHub repo
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/build`
4. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app`

### 3. GitHub Pages (Alternative)
1. Build frontend: `cd frontend && npm run build`
2. Deploy `build` folder to GitHub Pages
3. Update API URL in environment

## 📊 API Endpoints

- `GET /health` - Health check
- WebSocket events:
  - `createPoll` - Create poll
  - `studentJoin` - Student joins
  - `submitAnswer` - Submit answer
  - `endPollNow` - End poll
  - `getCurrentPoll` - Get active poll
  - `getPollHistory` - Get history
  - `sendMessage` - Chat message

## 🐛 Troubleshooting

### Common Issues
1. **Student not receiving polls**: Check CORS and socket connection
2. **Socket connection failed**: Verify backend URL and port
3. **Build errors**: Check environment variables

### Debug Steps
1. Check browser console for errors
2. Verify backend health: `curl https://your-backend-url.railway.app/health`
3. Check environment variables
4. Ensure both apps use same backend URL

## 📄 License

MIT License - see LICENSE file for details.

## 👨‍💻 Author

**Prabhat Gupta (prabhatzz)**
- GitHub: [@prabhatzz](https://github.com/prabhatzz)
- LinkedIn: [Prabhat Gupta](https://linkedin.com/in/prabhatzz)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

- Create GitHub issue
- Contact: prabhatzz@example.com

---

⭐ **Star this repository if helpful!**

