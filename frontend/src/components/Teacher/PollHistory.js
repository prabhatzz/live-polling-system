import React from 'react';

import { useSelector } from 'react-redux';

const PollHistory = ({ open, onClose, pageSize = 5 }) => {
  const history = useSelector(s => s.poll.pollHistory) || [];
  if (!open) return null;

  const items = history.slice(-pageSize).reverse();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 840 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>View Poll History</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="history-list">
          {items.length === 0 && (
            <div className="note-centered" style={{ padding: 16 }}>No past polls yet.</div>
          )}

          {items.map((h, idx) => (
            <div key={h.id || idx} className="results-card" style={{ marginBottom: 18 }}>
              <div className="results-head">{h.question}</div>
              {(h.options || []).map((opt, i) => {
                const count = (h.results || {})[opt] || 0;
                const total = Number(h.totalAnswers) || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={`${opt}-${i}`} className="option-line">
                    <div className="option-chip">{i + 1}</div>
                    <div className="bar">
                      <div className="fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="percent">{pct}%</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PollHistory;

