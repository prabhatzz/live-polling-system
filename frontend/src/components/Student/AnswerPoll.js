import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAnswered, setCurrentAnswer } from '../../store/reducers/userReducer';

const AnswerPoll = ({ poll, socket }) => {
	const dispatch = useDispatch();
	const [selected, setSelected] = useState('');
	const [timeLeft, setTimeLeft] = useState(poll.timeLimit || 60);

	useEffect(() => {
		const t = setInterval(() => {
			const elapsed = Math.floor((new Date() - new Date(poll.createdAt)) / 1000);
			const remaining = Math.max(0, (poll.timeLimit || 60) - elapsed);
			setTimeLeft(remaining);
			if (remaining === 0) clearInterval(t);
		}, 1000);
		setSelected('');
		return () => clearInterval(t);
	}, [poll]);

	const submit = (e) => {
		e.preventDefault();
		if (!selected) return;
		socket.emit('submitAnswer', { answer: selected });
		dispatch(setAnswered(true));
		dispatch(setCurrentAnswer(selected));
	};

	return (
	<div style={{ maxWidth: 820, margin: '24px auto 40px' }}>
		<div className="qtitle-row">
			<div className="qtitle">Question 1</div>
			<div className="timer-red">
				<span className="dot" /> 00:{String(Math.max(0, timeLeft)).padStart(2, '0')}
			</div>
		</div>

		<div className="qcard">
			<div className="qhead">{poll.question}</div>

			<form onSubmit={submit} style={{ padding: 14 }}>
				{(poll.options || []).map((opt, idx) => (
					<div key={`${opt}-${idx}`} className="qopt">
						<div className="qnum">{idx + 1}</div>
						<label className={`qchoice ${selected === opt ? 'active' : ''}`}>
							<input type="radio" name="answer" value={opt} checked={selected === opt} onChange={(e) => setSelected(e.target.value)} />
							<span>{opt}</span>
						</label>
					</div>
				))}

				<div style={{ display: 'flex', justifyContent: 'center', marginTop: 18, marginBottom: 6 }}>
					<button type="submit" className="submit-cta" disabled={!selected || timeLeft === 0}>Submit</button>
				</div>
			</form>
		</div>
	</div>
);
};

export default AnswerPoll;