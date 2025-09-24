import React, { useState } from 'react';

const StudentLogin = ({ onJoin }) => {
	const [name, setName] = useState('');

	const submit = (e) => {
		e.preventDefault();
		if (name.trim()) onJoin(name.trim());
	};

	return (
		<div className="landing">
			<div className="landing-inner">
				<div className="badge">✨ Intervue Poll</div>

				<h1 className="h1" style={{ marginBottom: 8 }}>
					Let’s <span>Get Started</span>
				</h1>

				<p className="sub" style={{ maxWidth: 720, marginBottom: 28 }}>
					If you’re a student, you’ll be able to <strong>submit your answers</strong>, participate in live
					polls, and see how your responses compare with your classmates
				</p>

				<form onSubmit={submit} style={{ maxWidth: 720, margin: '0 auto' }}>
					<label className="field-label">Enter your Name</label>
					<input
						className="input"
						placeholder="Rahul Bajaj"
						value={name}
						onChange={(e) => setName(e.target.value)}
						maxLength={50}
					/>

					<div className="cta" style={{ marginTop: 26 }}>
						<button className="btn-primary" type="submit" disabled={!name.trim()}>
							Continue
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default StudentLogin;