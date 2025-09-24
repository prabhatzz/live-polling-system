import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../../services/socketService';

const ChatPopup = ({ onClose }) => {
	const { messages } = useSelector(state => state.poll);
	const [input, setInput] = useState('');
	const endRef = useRef(null);
	const socket = socketService.getSocket();

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const send = (e) => {
		e.preventDefault();
		if (!input.trim()) return;
		socket.emit('sendMessage', { message: input.trim() });
		setInput('');
	};

	return (
		<div className="chat-popup">
			<div className="chat-header">
				<h3>Live Chat</h3>
				<button className="close-btn" onClick={onClose}>✕</button>
			</div>
			<div className="chat-messages">
				{messages.map(m => (
					<div key={m.id} className={`message ${m.isTeacher ? 'teacher' : 'student'}`}>
						<div className="message-header">
							<span className="sender">{m.sender}</span>
							<span className="timestamp">{new Date(m.timestamp).toLocaleTimeString()}</span>
						</div>
						<div className="message-content">{m.message}</div>
					</div>
				))}
				<div ref={endRef} />
			</div>
			<form className="chat-input" onSubmit={send}>
				<input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." maxLength={200} />
				<button type="submit">Send</button>
			</form>
		</div>
	);
};

export default ChatPopup;