import React, { useEffect, useState } from 'react';

const PollResults = ({ poll, results, onAskNew, socket }) => {
	const [timeLeft, setTimeLeft] = useState(0);

	useEffect(() => {
		if (!poll || !poll.isActive) return;
		const t = setInterval(() => {
			const elapsed = Math.floor((new Date() - new Date(poll.createdAt)) / 1000);
			setTimeLeft(Math.max(0, (poll.timeLimit || 60) - elapsed));
		}, 1000);
		return () => clearInterval(t);
	}, [poll]);

	if (!results) return null;


	return (
	<div style={{ maxWidth: 820, margin: '24px auto 40px' }}>
		<div className="qtitle-row">
			<div className="qtitle">Question</div>
			{poll?.isActive && (
				<div className="timer-red">
					<span className="dot" /> 00:{String(Math.max(0, timeLeft)).padStart(2, '0')}
				</div>
			)}
		</div>

		<div className="results-card">
			<div className="results-head">{results.question}</div>

			{(results.options || []).map((opt, i) => {
				const count = (results.results || {})[opt] || 0;
				const total = Number(results.totalAnswers) || 0;
				const pct = total > 0 ? Math.round((count / total) * 100) : 0;
				return (
					<div key={i} className="option-line">
						<div className="option-chip">{i + 1}</div>
						<div className="bar">
							<div className="fill" style={{ width: `${pct}%` }} />
						</div>
						<div className="percent">{pct}%</div>
					</div>
				);
			})}
		</div>

		<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22 }}>
			<div className="note-centered">
				<span>Total answers: {Number(results.totalAnswers) || 0}</span>
				<span style={{ marginLeft: 12 }}>Active students: {Number(results.totalActiveStudents) || 0}</span>
			</div>
			<div>
				{poll?.isActive ? (
					<button className="btn-outline" onClick={() => socket?.emit('endPollNow')}>End Poll</button>
				) : (
					<button className="ask-new-btn" onClick={onAskNew}>+ Ask a new question</button>
				)}
				<button className="btn-outline" style={{ marginLeft: 10 }} onClick={() => downloadCSV(results)}>
					Export CSV
				</button>
			</div>
		</div>
	</div>
);
};

function downloadCSV(r) {
  if (!r) return;
  const headers = ['Option', 'Votes'];
  const rows = (r.options || []).map(opt => [escapeCSV(opt), (r.results || {})[opt] || 0]);
  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(r.question || 'poll').slice(0,50).replace(/\s+/g,'_')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeCSV(text) {
  const t = String(text || '');
  if (/[",\n]/.test(t)) {
    return '"' + t.replace(/"/g, '""') + '"';
  }
  return t;
}

export default PollResults;