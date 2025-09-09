import React, { useState } from "react";
import Cover from "./components/Cover"; // import the Cover component

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen">
      {!started ? (
        <Cover onStart={() => setStarted(true)} />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <h1 className="text-3xl font-bold">Game Screen Placeholder</h1>
        </div>
      )}
    </div>
  );
}
