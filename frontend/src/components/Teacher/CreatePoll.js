import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setError, clearError } from '../../store/reducers/pollReducer';

const CreatePoll = ({ socket, onOpenHistory }) => {
	const dispatch = useDispatch();
	const [question, setQuestion] = useState('');
	const [options, setOptions] = useState([{ text: '' }, { text: '' }]);
	const [timeLimit, setTimeLimit] = useState(60);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const charCount = question.length;
	const timeOptions = useMemo(() => [30, 60, 90, 120, 180], []);

	const addOption = () => {
		if (options.length < 6) setOptions([...options, { text: '' }]);
	};

	const updateOption = (idx, value) => {
		const next = [...options];
		next[idx].text = value;
		setOptions(next);
	};

const handleSubmit = (e) => {
	e.preventDefault();

	// options is an array of objects like [{ text: 'opt1' }, ...]
	const trimmed = options.map(o => (o?.text || '').trim()).filter(Boolean);

	if (!question.trim()) return dispatch(setError('Please enter a question'));
	if (trimmed.length < 2) return dispatch(setError('Please provide at least 2 options'));
	// Allow duplicate option labels to avoid blocking submit

	if (!socket || !socket.connected) {
		dispatch(setError('Not connected to server. Refresh the page.'));
		console.log('[CreatePoll] socket not connected:', socket);
		return;
	}

	const payload = {
		question: question.trim(),
		options: trimmed,
		timeLimit: Math.min(Math.max(parseInt(timeLimit) || 60, 10), 300),
	};

	console.log('[CreatePoll] emitting createPoll:', payload);
	socket.emit('createPoll', payload);

	setTimeout(() => {
		setQuestion('');
		setOptions([{ text: '' }, { text: '' }]);
		setTimeLimit(60);
	}, 600);
};

	return (
		<div className="create-wrap">
			<div className="badge" style={{ margin: '0 0 14px' }}>✨ Intervue Poll</div>
			<h1 className="h1" style={{ textAlign: 'left', marginBottom: 8 }}>Let’s <span>Get Started</span></h1>
			<p className="sub" style={{ textAlign: 'left', maxWidth: 760, marginBottom: 24 }}>
				you’ll have the ability to create and manage polls, ask questions, and monitor
				your students' responses in real-time.
			</p>

			<form onSubmit={handleSubmit} className="form">
				<div className="row">
					<label className="field-label">Enter your question</label>

					<button
						type="button"
						className="btn-outline"
						style={{ marginLeft: 'auto' }}
						onClick={onOpenHistory}
					>
						👁 View Poll history
					</button>

					<div className="time-select">
						<select
							value={timeLimit}
							onChange={(e) => setTimeLimit(e.target.value)}
							className="select"
							aria-label="Time limit"
						>
							{timeOptions.map(t => (
								<option key={t} value={t}>{t} seconds</option>
							))}
						</select>
					</div>
				</div>

				<div className="textarea-wrap">
					<textarea
						className="textarea"
						placeholder="Type your question here..."
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						rows={5}
						maxLength={100}
					/>
					<div className="counter">{charCount}/100</div>
				</div>

				<div className="grid-2">
					<div>
						<label className="section-title">Edit Options</label>
						{options.map((opt, idx) => (
							<div key={idx} className="option-row">
								<div className="chip-index">{idx + 1}</div>
								<input
									className="input"
									placeholder="Option text"
									value={opt.text}
									onChange={(e) => updateOption(idx, e.target.value)}
									maxLength={100}
								/>
							</div>
						))}
						<button type="button" className="btn-outline" onClick={addOption} disabled={options.length >= 6}>
							+ Add More option
						</button>
					</div>

					<div>
						<label className="section-title">Is it Correct?</label>
						{options.map((_, idx) => (
							<div key={idx} className="yn-row">
								<label className="radio">
									<input type="radio" name={`yn-${idx}`} defaultChecked />
									<span>Yes</span>
								</label>
								<label className="radio" style={{ marginLeft: 18 }}>
									<input type="radio" name={`yn-${idx}`} />
									<span>No</span>
								</label>
							</div>
						))}
					</div>
				</div>

				<div className="footer-stick">
					<button type="submit" className="btn-cta" disabled={isSubmitting}>
						{isSubmitting ? 'Creating…' : 'Ask Question'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreatePoll;