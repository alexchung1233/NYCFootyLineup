import React, { useState } from "react";

export default function SoccerLineup() {
  const [guysInput, setGuysInput] = useState("");
  const [girlsInput, setGirlsInput] = useState("");
  const [lineup, setLineup] = useState(null);

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const handleGenerate = () => {
    const guys = guysInput.split("\n").map((x) => x.trim()).filter(Boolean);
    const girls = girlsInput.split("\n").map((x) => x.trim()).filter(Boolean);

    if (guys.length < 5 || girls.length < 2 ) {
      alert("Need at least 5 guys and 2 girls!");
      return;
    }

    const shuffledGuys = shuffle(guys);
    const shuffledGirls = shuffle(girls);

    const tableGuys = shuffledGuys.slice(0, 5);
    const tableGirls = shuffledGirls.slice(0, 2);

    setLineup({
      firstHalf: [...tableGuys, ...tableGirls],
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Soccer Lineup Selector</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="font-semibold">Guys (one per line):</label>
          <textarea
            className="w-full border p-2 mt-1"
            rows="10"
            value={guysInput}
            onChange={(e) => setGuysInput(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="font-semibold">Girls (one per line):</label>
          <textarea
            className="w-full border p-2 mt-1"
            rows="10"
            value={girlsInput}
            onChange={(e) => setGirlsInput(e.target.value)}
          ></textarea>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Generate Lineup
      </button>

      {lineup && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Team Lineup</h2>
          <ul className="list-disc ml-4 mb-4">
            {lineup.firstHalf.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

