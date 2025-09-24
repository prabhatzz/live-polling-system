import React from 'react';

const FabChat = ({ onClick }) => (
	<button className="fab-chat" onClick={onClick} aria-label="Open chat">
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-4 4v-4H6a2 2 0 01-2-2V6z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
	</button>
);

export default FabChat;