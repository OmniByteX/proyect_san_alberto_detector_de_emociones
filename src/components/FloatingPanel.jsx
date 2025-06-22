import React from 'react';

export default function FloatingPanel({ emotionData }) {
  
  let topEmotion = { name: 'N/A', score: 0 };

  Object.values(emotionData).forEach((expr) => {
    if (!expr) return;
    const max = Object.entries(expr).reduce((a, b) => (a[1] > b[1] ? a : b));
    if (max[1] > topEmotion.score) {
      topEmotion = { name: max[0], score: max[1] };
    }
  });

  const emojis = {
    happy: '😊',
    neutral: '😐',
    angry: '😠',
    sad: '😢',
    surprised: '😲',
    disgusted: '🤢',
    fearful: '😨',
  };

  return (
    <div className="floating-panel">
      <h3>Emoción predominante</h3>
      <div className="emotion-main">
        <span className="emoji">{emojis[topEmotion.name] || '❓'}</span>
        <span className="emotion-name">{topEmotion.name}</span>
        <span className="emotion-score">{(topEmotion.score * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
}
