import React, { useState } from "react";
import Cover from "./components/Cover";
import GamePage from "./components/GamePage";

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen">
      {!started ? (
        <Cover onStart={() => setStarted(true)} />
      ) : (
        <GamePage />
      )}
    </div>
  );
}
