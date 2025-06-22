import React, { useState } from "react";
import FaceScanner from "./FaceScanner";

export default function Dashboard({ user, logout }) {
  const [scanning, setScanning] = useState(true);

  return (
    <div className="dashboard-container">
      <header>
        <h2>Bienvenido, {user.username}</h2>
        <button className="logout-btn" onClick={logout}>
          Cerrar sesión
        </button>
      </header>

      {scanning ? (
        <FaceScanner stopScan={() => setScanning(false)} />
      ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={() => setScanning(true)}>Iniciar Escaneo</button>
        </div>
      )}
    </div>
  );
}
