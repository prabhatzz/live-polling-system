import React, { useState } from 'react';
import TeacherDashboard from './Teacher/TeacherDashboard';
import StudentDashboard from './Student/StudentDashboard';
import '../styles/App.css';

export default function App() {
  const [userType, setUserType] = useState(null);
  const [selected, setSelected] = useState(null);

  if (!userType) {
    return (
      <div className="landing-inner">
        <div style={{ width: '100%', maxWidth: 980 }}>
          <div className="badge">✨ Intervue Poll</div>
          <h1 className="h1">Welcome to the <span>Live Polling System</span></h1>
          <div className="sub">
            Please select the role that best describes you to begin using the live polling system
            <br /> system
          </div>

          <div className="role-row">
            <div
              className={`role-card ${selected === 'student' ? 'active' : ''}`}
              onClick={() => setSelected('student')}
            >
              <div className="role-title">I’m a Student</div>
              <div className="role-sub">Lorem Ipsum is simply dummy text of the printing and typesetting industry</div>
            </div>

            <div
              className={`role-card ${selected === 'teacher' ? 'active' : ''}`}
              onClick={() => setSelected('teacher')}
            >
              <div className="role-title">I’m a Teacher</div>
              <div className="role-sub">Submit answers and view live poll results in real-time.</div>
            </div>
          </div>

          <div className="cta">
            <button
              className="btn-primary"
              disabled={!selected}
              onClick={() => setUserType(selected)}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return userType === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />;
}