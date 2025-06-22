import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);

  
  return user ? (
    <Dashboard user={user} logout={() => setUser(null)} />
  ) : (
    <Login onLogin={setUser} />
  );
}
