import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	setCurrentPoll,
	setPollResults,
	addMessage,
	setMessages,
	setStudents,
	setPollHistory,
	setError,
	clearError
} from '../../store/reducers/pollReducer';
import { setConnected } from '../../store/reducers/userReducer';
import CreatePoll from './CreatePoll';
import PollResults from './PollResults';
import ChatModal from '../Shared/ChatModal';
import PollHistory from './PollHistory';
import FabChat from '../Shared/FabChat';
import socketService from '../../services/socketService';

const TeacherDashboard = () => {
	const dispatch = useDispatch();
	const { currentPoll, results, messages, students } = useSelector(s => s.poll);
	const [socket, setSocket] = useState(null);
	const [openChat, setOpenChat] = useState(false);
	const [openHistory, setOpenHistory] = useState(false);

	useEffect(() => {
		const s = socketService.connect();
    s.on('connect', () => console.log('[Teacher] socket connected:', s.id));
s.on('connect_error', (err) => console.log('[Teacher] connect_error:', err));
s.on('error', (msg) => console.log('[Teacher] server error:', msg));
s.on('pollCreated', (poll) => console.log('[Teacher] pollCreated:', poll));
s.on('newPoll', (poll) => console.log('[Teacher] newPoll:', poll));
		setSocket(s);
		dispatch(setConnected(true));

		// Poll events
		s.on('pollCreated', (poll) => { dispatch(setCurrentPoll(poll)); dispatch(clearError()); });
		s.on('newPoll', (poll) => dispatch(setCurrentPoll(poll)));
		s.on('pollResults', (r) => dispatch(setPollResults(r)));
		s.on('pollEnded', () => { /* noop, results will arrive */ });

		// Students
		s.on('studentJoined', (st) => dispatch(setStudents([...(students || []), st])));
		s.on('studentLeft', (d) => dispatch(setStudents((students || []).filter(x => x.id !== d.studentId))));
		s.on('studentRemoved', (d) => dispatch(setStudents((students || []).filter(x => x.id !== d.studentId))));
		s.on('studentList', (list) => dispatch(setStudents(list)));

		// Chat
		s.on('newMessage', (m) => dispatch(addMessage(m)));
		s.on('chatHistory', (hist) => dispatch(setMessages(hist)));

		// History
		s.on('pollHistory', (hist) => dispatch(setPollHistory(hist)));

		// Errors / connection
		s.on('error', (msg) => dispatch(setError(msg)));
		s.on('connect', () => { dispatch(setConnected(true)); dispatch(clearError()); });
		s.on('disconnect', () => dispatch(setConnected(false)));

		// initial pulls
		s.emit('getStudents');
		s.emit('getChatHistory');
		s.emit('getPollHistory');

		return () => { s.disconnect(); dispatch(setConnected(false)); };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	const removeStudent = (id) => socket?.emit('removeStudent', id);

	return (
		<div className="teacher-dashboard">
			<div className="dashboard-content" style={{ maxWidth: 980, margin: '0 auto' }}>
				{(!currentPoll || !currentPoll.isActive) && <CreatePoll socket={socket} onOpenHistory={() => setOpenHistory(true)} />}

		{currentPoll && (
				<PollResults
						poll={currentPoll}
						results={results}
					socket={socket}
					onAskNew={() => dispatch(clearError()) || setTimeout(() => setSocket(socket), 0)}
					/>
				)}
			</div>

			<FabChat onClick={() => setOpenChat(true)} />
			<ChatModal
				open={openChat}
				onClose={() => setOpenChat(false)}
				messages={messages}
				participants={students || []}
				socket={socket}
				removeStudent={removeStudent}
			/>

			<PollHistory open={openHistory} onClose={() => setOpenHistory(false)} history={[]} />
		</div>
	);
};

export default TeacherDashboard;