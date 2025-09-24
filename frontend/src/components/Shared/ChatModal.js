import React, { useEffect, useRef, useState } from 'react';

const ChatModal = ({ open, onClose, messages, participants = [], socket, removeStudent }) => {
	const [tab, setTab] = useState('chat'); // 'chat' | 'participants'
	const [input, setInput] = useState('');
	const endRef = useRef(null);

	useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

	if (!open) return null;

	const send = (e) => {
		e.preventDefault();
		if (!input.trim()) return;
		socket.emit('sendMessage', { message: input.trim() });
		setInput('');
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-card" onClick={(e) => e.stopPropagation()}>
				<div className="modal-tabs">
					<button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>Chat</button>
					<button className={tab === 'participants' ? 'active' : ''} onClick={() => setTab('participants')}>Participants</button>
				</div>

				{tab === 'chat' && (
					<div className="chat-pane">
						<div className="chat-scroll">
							{messages.map(m => (
								<div key={m.id} className={`bubble ${m.isTeacher ? 't' : 's'}`}>
									<div className="meta">{m.sender}</div>
									<div className="text">{m.message}</div>
								</div>
							))}
							<div ref={endRef} />
						</div>
						<form className="chat-input" onSubmit={send}>
							<input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." maxLength={200} />
							<button type="submit">Send</button>
						</form>
					</div>
				)}

				{tab === 'participants' && (
					<div className="participants-pane">
						<div className="row head">
							<span>Name</span>
							<span>Action</span>
						</div>
						<div className="list">
							{participants.map(p => (
								<div key={p.id} className="row">
									<span>{p.name}</span>
									<button className="link" onClick={() => removeStudent?.(p.id)}>Kick out</button>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatModal;