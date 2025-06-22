import React from "react";

export default function EmotionCard({ emotion, value }) {
  const percent = (value * 100).toFixed(1);

  const colors = {
    happy: "#FFD700",
    sad: "#1E90FF",
    angry: "#FF4500",
    fearful: "#8A2BE2",
    disgusted: "#556B2F",
    surprised: "#FF69B4",
    neutral: "#A9A9A9",
  };

  return (
    <div className="emotion-card">
      <strong>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</strong>
      <div className="bar-bg">
        <div className="bar-fill" style={{ width: `${percent}%`, backgroundColor: colors[emotion] || "#777" }} />
      </div>
      <span>{percent}%</span>
    </div>
  );
}
