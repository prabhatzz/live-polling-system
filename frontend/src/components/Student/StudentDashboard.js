import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setCurrentPoll,
	setPollResults,
	addMessage,
	setMessages,
	setError,
	clearError
} from '../../store/reducers/pollReducer';
import {
	setName,
	setUserType,
	setAnswered,
	setCurrentAnswer,
	setConnected
} from '../../store/reducers/userReducer';
import StudentLogin from './StudentLogin';
import AnswerPoll from './AnswerPoll';
import PollResults from '../Teacher/PollResults';
import ChatModal from '../Shared/ChatModal';
import FabChat from '../Shared/FabChat';
import WaitingScreen from './WaitingScreen';
import socketService from '../../services/socketService';

const StudentDashboard = () => {
	const dispatch = useDispatch();
	const { currentPoll, results, messages, error } = useSelector(s => s.poll);
	const { name, hasAnswered } = useSelector(s => s.user);

	const [socket, setSocket] = useState(null);
	const [openChat, setOpenChat] = useState(false);

	useEffect(() => {
		const s = socketService.connect();
		setSocket(s);
		dispatch(setConnected(true));

		s.on('joined', (data) => { dispatch(setCurrentPoll(data.currentPoll)); dispatch(clearError()); });
		s.on('newPoll', (poll) => { dispatch(setCurrentPoll(poll)); dispatch(setAnswered(false)); dispatch(setCurrentAnswer(null)); });
		s.on('pollResults', (r) => dispatch(setPollResults(r)));
		s.on('pollEnded', () => dispatch(setAnswered(true)));

		s.on('newMessage', (m) => dispatch(addMessage(m)));
		s.on('chatHistory', (hist) => dispatch(setMessages(hist)));

		s.on('removed', (d) => { alert(`Removed: ${d.reason}`); window.location.reload(); });

		s.on('error', (msg) => dispatch(setError(msg)));
		s.on('connect', () => { dispatch(setConnected(true)); dispatch(clearError()); });
		s.on('disconnect', () => dispatch(setConnected(false)));

		s.emit('getChatHistory');
		// ask server for current poll immediately in case we joined late
		s.emit('getCurrentPoll');

		return () => { s.disconnect(); dispatch(setConnected(false)); };
	}, [dispatch]);

	const handleJoin = (studentName) => {
		dispatch(setName(studentName));
		dispatch(setUserType('student'));
		if (socket && socket.connected) {
			socket.emit('studentJoin', { name: studentName });
		} else {
			const s = socketService.connect();
			setSocket(s);
			s.once('connect', () => {
				s.emit('studentJoin', { name: studentName });
			});
		}
	};

	if (!name) return <StudentLogin onJoin={handleJoin} />;

	return (
		<div className="student-dashboard">
			<div className="dashboard-content" style={{ maxWidth: 980, margin: '0 auto' }}>
				{currentPoll && currentPoll.isActive && !hasAnswered && (
					<AnswerPoll poll={currentPoll} socket={socket} />
				)}

				{results && (hasAnswered || (currentPoll && !currentPoll.isActive)) && (
					<>
						<PollResults poll={currentPoll} results={results} />
						{!results.isActive && (
							<div className="note-centered" style={{ marginTop: 24 }}>
								Wait for the teacher to ask a new question..
							</div>
						)}
					</>
				)}

				{!currentPoll && <WaitingScreen />}

				{error && <div className="error-banner"><span>{error}</span></div>}
			</div>

			<FabChat onClick={() => setOpenChat(true)} />
			<ChatModal
				open={openChat}
				onClose={() => setOpenChat(false)}
				messages={messages}
				socket={socket}
				participants={[]}
			/>
		</div>
	);
};

export default StudentDashboard;