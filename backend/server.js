const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.io
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://prabhatzz.github.io",
      "https://prabhatzz.github.io/live-polling-system"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://prabhatzz.github.io",
    "https://prabhatzz.github.io/live-polling-system"
  ],
  credentials: true
}));
app.use(express.json());

// In-memory storage (in production, use Redis or database)
let polls = new Map();
let students = new Map();
let currentPoll = null;
let pollHistory = [];
let chatMessages = [];

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Teacher creates a new poll
  socket.on('createPoll', (data) => {
    try {
      const pollId = uuidv4();
      const poll = {
        id: pollId,
        question: data.question.trim(),
        options: data.options.filter(opt => opt.trim()),
        timeLimit: Math.min(Math.max(parseInt(data.timeLimit) || 60, 10), 300),
        createdAt: new Date(),
        answers: new Map(),
        isActive: true,
        teacherId: socket.id,
        totalStudents: students.size
      };
      
      if (!poll.question || poll.options.length < 2) {
        socket.emit('error', 'Invalid poll data');
        return;
      }
      
      polls.set(pollId, poll);
      currentPoll = poll;
      
      students.forEach(student => {
        student.hasAnswered = false;
        student.currentAnswer = null;
        student.answerTime = null;
      });
      
      socket.emit('pollCreated', poll);
      io.emit('newPoll', poll);
      
      setTimeout(() => {
        if (currentPoll && currentPoll.id === pollId && currentPoll.isActive) {
          endPoll(pollId);
        }
      }, poll.timeLimit * 1000);
      
    } catch (error) {
      console.error('Error creating poll:', error);
      socket.emit('error', 'Failed to create poll');
    }
  });

  // Student joins
  socket.on('studentJoin', (data) => {
    try {
      const studentName = data.name.trim();
      if (!studentName || studentName.length > 50) {
        socket.emit('error', 'Invalid name');
        return;
      }

      const existingStudent = Array.from(students.values()).find(s => s.name === studentName);
      if (existingStudent) {
        socket.emit('error', 'Name already taken');
        return;
      }

      const student = {
        id: socket.id,
        name: studentName,
        hasAnswered: false,
        currentAnswer: null,
        answerTime: null,
        joinedAt: new Date()
      };
      
      students.set(socket.id, student);
      socket.emit('joined', { student, currentPoll });
      
      if (currentPoll?.teacherId) {
        io.to(currentPoll.teacherId).emit('studentJoined', student);
      }
      
    } catch (error) {
      console.error('Error joining student:', error);
      socket.emit('error', 'Failed to join');
    }
  });

  // Student submits answer
  socket.on('submitAnswer', (data) => {
    try {
      if (!currentPoll || !currentPoll.isActive) {
        socket.emit('error', 'No active poll');
        return;
      }

      const student = students.get(socket.id);
      if (!student) {
        socket.emit('error', 'Student not found');
        return;
      }

      if (student.hasAnswered) {
        socket.emit('error', 'Already answered');
        return;
      }

      if (!data.answer || !currentPoll.options.includes(data.answer)) {
        socket.emit('error', 'Invalid answer');
        return;
      }

      const answerTime = new Date();
      currentPoll.answers.set(socket.id, {
        studentName: student.name,
        answer: data.answer,
        timestamp: answerTime
      });

      student.hasAnswered = true;
      student.currentAnswer = data.answer;
      student.answerTime = answerTime;

      const activeStudents = Array.from(students.values()).filter(s => s.joinedAt <= currentPoll.createdAt);
      const allAnswered = activeStudents.every(s => s.hasAnswered);
      
      if (allAnswered && activeStudents.length > 0) {
        endPoll(currentPoll.id);
      }

      io.emit('pollResults', getPollResults(currentPoll));
      
    } catch (error) {
      console.error('Error submitting answer:', error);
      socket.emit('error', 'Failed to submit answer');
    }
  });

  // Get current poll results
  socket.on('getResults', () => {
    if (currentPoll) {
      socket.emit('pollResults', getPollResults(currentPoll));
    }
  });

  // Get current active poll (for late joiners before they submit their name)
  socket.on('getCurrentPoll', () => {
    if (currentPoll) {
      socket.emit('newPoll', currentPoll);
    }
  });

  // Teacher ends poll immediately
  socket.on('endPollNow', () => {
    try {
      if (currentPoll && currentPoll.isActive && currentPoll.teacherId === socket.id) {
        endPoll(currentPoll.id);
      }
    } catch (e) {
      console.error('Error ending poll now:', e);
    }
  });

  // Teacher removes student
  socket.on('removeStudent', (studentId) => {
    try {
      if (students.has(studentId)) {
        const student = students.get(studentId);
        students.delete(studentId);
        
        if (currentPoll) {
          currentPoll.answers.delete(studentId);
          io.emit('pollResults', getPollResults(currentPoll));
        }
        
        io.to(studentId).emit('removed', { reason: 'removed by teacher' });
        socket.emit('studentRemoved', { studentId, studentName: student.name });
      }
    } catch (error) {
      console.error('Error removing student:', error);
    }
  });

  // Chat functionality
  socket.on('sendMessage', (data) => {
    try {
      const student = students.get(socket.id);
      const message = {
        id: uuidv4(),
        sender: student ? student.name : 'Teacher',
        message: data.message.trim().substring(0, 200),
        timestamp: new Date(),
        isTeacher: !student,
        senderId: socket.id
      };
      
      chatMessages.push(message);
      
      if (chatMessages.length > 100) {
        chatMessages = chatMessages.slice(-100);
      }
      
      io.emit('newMessage', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Get chat history
  socket.on('getChatHistory', () => {
    socket.emit('chatHistory', chatMessages.slice(-50));
  });

  // Get poll history
  socket.on('getPollHistory', () => {
    socket.emit('pollHistory', pollHistory.slice(-10));
  });

  // Get student list
  socket.on('getStudents', () => {
    const studentList = Array.from(students.values()).map(student => ({
      id: student.id,
      name: student.name,
      hasAnswered: student.hasAnswered,
      joinedAt: student.joinedAt
    }));
    socket.emit('studentList', studentList);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    const student = students.get(socket.id);
    
    if (student) {
      students.delete(socket.id);
      
      if (currentPoll) {
        currentPoll.answers.delete(socket.id);
        io.emit('pollResults', getPollResults(currentPoll));
      }
      
      if (currentPoll?.teacherId) {
        io.to(currentPoll.teacherId).emit('studentLeft', { studentId: socket.id, studentName: student.name });
      }
    }
  });
});

function endPoll(pollId) {
  const poll = polls.get(pollId);
  if (poll && poll.isActive) {
    poll.isActive = false;
    poll.endedAt = new Date();
    
    pollHistory.push({
      ...poll,
      answers: Array.from(poll.answers.values()),
      totalStudents: students.size
    });
    
    if (pollHistory.length > 20) {
      pollHistory = pollHistory.slice(-20);
    }
    
    io.emit('pollEnded', pollId);
    io.emit('pollResults', getPollResults(poll));
  }
}

function getPollResults(poll) {
  if (!poll) return null;
  
  const results = {};
  poll.options.forEach(option => {
    results[option] = 0;
  });

  poll.answers.forEach(answer => {
    if (results.hasOwnProperty(answer.answer)) {
      results[answer.answer]++;
    }
  });

  const activeStudents = Array.from(students.values()).filter(s => s.joinedAt <= poll.createdAt);
  const totalActiveStudents = activeStudents.length;
  const answeredStudents = poll.answers.size;

  return {
    pollId: poll.id,
    question: poll.question,
    options: poll.options,
    results,
    totalAnswers: answeredStudents,
    totalActiveStudents,
    isActive: poll.isActive,
    answers: Array.from(poll.answers.values()),
    timeLeft: poll.isActive ? Math.max(0, poll.timeLimit - Math.floor((new Date() - new Date(poll.createdAt)) / 1000)) : 0,
    createdAt: poll.createdAt,
    endedAt: poll.endedAt
  };
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    activeStudents: students.size,
    currentPoll: currentPoll ? currentPoll.id : null,
    author: 'prabhatzz'
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`�� Live Polling Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`��‍💻 Deployed by: prabhatzz`);
});