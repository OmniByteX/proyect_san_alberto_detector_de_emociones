import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import EmotionCard from "./EmotionCard";

export default function FaceScanner({ stopScan }) {
  const videoRef = useRef(null);
  const [emotions, setEmotions] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [summary, setSummary] = useState(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
      startVideo();
    };

    loadModels();

    return () => {
      stopVideo();
    };
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanning(true);
      })
      .catch((err) => {
        console.error("Error al acceder a la cámara: ", err);
      });
  };

  const stopVideo = () => {
    let stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setScanning(false);
    }
  };

  useEffect(() => {
    if (!modelsLoaded || !scanning) return;

    const interval = setInterval(async () => {
      if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detection && detection.expressions) {
          setEmotions(detection.expressions);
        } else {
          setEmotions(null);
        }
      }
    }, 400);

    return () => clearInterval(interval);
  }, [modelsLoaded, scanning]);

  const handleStop = () => {
    stopVideo();
    setScanning(false);

    if (!emotions) {
      setSummary({ max: null, min: null });
      return;
    }

    // Encontrar max y min emociones (excepto neutral para min si quieres)
    const entries = Object.entries(emotions);
    let max = entries[0];
    let min = entries[0];

    for (const entry of entries) {
      if (entry[1] > max[1]) max = entry;
      if (entry[1] < min[1]) min = entry;
    }

    setSummary({
      max: { name: max[0], value: (max[1] * 100).toFixed(1) },
      min: { name: min[0], value: (min[1] * 100).toFixed(1) },
    });
  };

  return (
    <div className="face-scanner-container">
      <video
        ref={videoRef}
        width="480"
        height="360"
        muted
        style={{ borderRadius: "12px", border: "3px solid #4A90E2", boxShadow: "0 0 15px #4A90E2" }}
      />
      {!modelsLoaded && <p>Cargando modelos...</p>}

      {emotions && scanning && (
        <div className="emotions-cards">
          {Object.entries(emotions).map(([emotion, value]) => (
            <EmotionCard key={emotion} emotion={emotion} value={value} />
          ))}
        </div>
      )}

      {!scanning && summary && (
        <div className="summary-container">
          <h3>Resumen del análisis</h3>
          {summary.max && (
            <p>
              <strong>Emoción más alta:</strong> {summary.max.name} ({summary.max.value}%)
            </p>
          )}
          {summary.min && (
            <p>
              <strong>Emoción más baja:</strong> {summary.min.name} ({summary.min.value}%)
            </p>
          )}
          {!summary.max && <p>No se detectaron emociones.</p>}
        </div>
      )}

      {scanning ? (
        <button className="btn-stop" onClick={handleStop}>
          Detener análisis
        </button>
      ) : (
        <button className="btn-primary" onClick={() => {
          setSummary(null);
          startVideo();
        }}>
          Reanudar análisis
        </button>
      )}
    </div>
  );
}
