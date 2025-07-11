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

    if (guys.length < 4 || girls.length < 2 ) {
      alert("Need at least 4 guys and 2 girls!");
      return;
    }

    const shuffledFirstHalfGuys = shuffle(guys);
    const shuffledFirstHalfGirls = shuffle(girls);

    const tableFirstHalfGuys = shuffledFirstHalfGuys.slice(0, 5);
    const tableFirstHalfRemainingGuys = shuffledFirstHalfGuys.slice(5, guys.length);
    const tableFirstHalfGirls = shuffledFirstHalfGirls.slice(0, 2);
    const tableFirstHalfRemainingGirls = shuffledFirstHalfGirls.slice(2, girls.length);

    const shuffledSecondHalfGuys = shuffle(guys);
    const shuffledSecondHalfGirls = shuffle(girls);

    const tableSecondHalfGuys = shuffledSecondHalfGuys.slice(0, 5);
    const tableSecondHalfRemainingGuys = shuffledSecondHalfGuys.slice(5, guys.length);
    const tableSecondHalfGirls = shuffledSecondHalfGirls.slice(0, 2);
    const tableSecondHalfRemainingGirls = shuffledSecondHalfGirls.slice(2, girls.length);

    setLineup({
      firstHalf: [...tableFirstHalfGuys, ...tableFirstHalfGirls],
      firstHalfRemainingPeople: [...tableFirstHalfRemainingGuys, ...tableFirstHalfRemainingGirls],
      secondHalf: [...tableSecondHalfGuys, ...tableSecondHalfGirls],
      secondHalfRemainingPeople: [...tableSecondHalfRemainingGuys, ...tableSecondHalfRemainingGirls],
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">NYCFooty Lineup Generator</h1>
      <p className="text-sm text-gray-500 mb-4">
        This is made for a 7 vs 7 game - 5 guys and 2 girls per half. <br />
        <br />
        The input is just for field players (so minimum of 4 guys and 2 girls). <br />
        <br />
        The goalkeepers are not included. <br />
      </p>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="font-semibold">Guys (one per line. Min 4):</label>
          <textarea
            className="w-full border p-2 mt-1"
            rows="10"
            value={guysInput}
            onChange={(e) => setGuysInput(e.target.value)}
          ></textarea>
        </div>
  
        <div>
          <label className="font-semibold">Girls (one per line. Min 2):</label>
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
        <div className="mt-8 space-y-8">
          {/* Top row: first & second half lineups side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">First Half Lineup</h2>
              <ul className="list-disc ml-4 mb-4">
                {lineup.firstHalf.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Second Half Lineup</h2>
              <ul className="list-disc ml-4 mb-4">
                {lineup.secondHalf.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            </div>
          </div>
  
          {/* Bottom row: first & second half remaining people side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">First Half Remaining People</h2>
              <ul className="list-disc ml-4 mb-4">
                {lineup.firstHalfRemainingPeople.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Second Half Remaining People</h2>
              <ul className="list-disc ml-4 mb-4">
                {lineup.secondHalfRemainingPeople.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}