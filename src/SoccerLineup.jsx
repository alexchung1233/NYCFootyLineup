import React, { useState } from "react";
import playersData from './heat-wave-players.json';

export default function SoccerLineup() {
  let num_current_attackers = 0;
  let num_current_defenders = 0;

  const [guysInput, setGuysInput] = useState("");
  const [girlsInput, setGirlsInput] = useState("");
  const [lineup, setLineup] = useState(null);

  const handleClear = () => {
    setGuysInput("");
    setGirlsInput("");
    setLineup(null);
  };

  const balancePositions = (players) => {
    const defenders = players.filter(p => p.includes("- Defender"));
    const attackers = players.filter(p => p.includes("- Attacker"));
    while (num_current_attackers > 3 ) {
      // get random attacker
      const randomAttacker = attackers[Math.floor(Math.random() * attackers.length)];
      // remove attacker from attackers
      attackers.splice(attackers.indexOf(randomAttacker), 1);
      // add attacker to defenders
      defenders.push(randomAttacker);
      // update num_current_attackers
      num_current_attackers--;
    }
    while (num_current_defenders > 3 ) {
      // get random defender
      const randomDefender = defenders[Math.floor(Math.random() * defenders.length)];
      // remove defender from defenders
      defenders.splice(defenders.indexOf(randomDefender), 1);
      // add defender to attackers
      attackers.push(randomDefender);
      // update num_current_defenders
      num_current_defenders--;
    }
    return [...defenders, ...attackers];
  };

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const getRandomRole = () => {
    return Math.random() < 0.5 ? "Attacker" : "Defender";
  };

  const handleLoadPlayers = () => {
    const malePlayersText = playersData.players
      .filter(player => player.gender === "MALE")
      .map(player => `${player.name} - ${player.role}`)
      .join('\n');

    const femalePlayersText = playersData.players
      .filter(player => player.gender === "FEMALE")
      .map(player => `${player.name} - ${player.role}`)
      .join('\n');

    setGuysInput(malePlayersText);
    setGirlsInput(femalePlayersText);
  };

  const sortByPosition = (players) => {
    return players.sort((a, b) => {
      const [, positionA] = a.split(" - ");
      const [, positionB] = b.split(" - ");
      // Sort Defenders before Attackers
      return positionA.localeCompare(positionB);
    });
  };

  const handleGenerate = () => {
    const processPlayers = (input) => {
      return input.split("\n")
        .map(line => {
          const [name, role] = line.split(" - ").map(x => x.trim());
          const finalRole = role === "ANYTHING" ? getRandomRole() : role;
          if (finalRole === "Attacker") {
            num_current_attackers++;
          } else if (finalRole === "Defender") {
            num_current_defenders++;
          }
          return `${name} - ${finalRole}`;
        })
        .filter(Boolean);
    };

    const guys = processPlayers(guysInput);
    const girls = processPlayers(girlsInput);

    const shuffledFirstHalfGuys = shuffle(guys);
    const shuffledFirstHalfGirls = shuffle(girls);

    const tableFirstHalfGuys = sortByPosition(shuffledFirstHalfGuys.slice(0, 4));  // Changed from 5 to 4
    const tableFirstHalfRemainingGuys = sortByPosition(shuffledFirstHalfGuys.slice(4, guys.length));  // Changed from 5 to 4
    const tableFirstHalfGirls = sortByPosition(shuffledFirstHalfGirls.slice(0, 2));
    const tableFirstHalfRemainingGirls = sortByPosition(shuffledFirstHalfGirls.slice(2, girls.length));

    const shuffledSecondHalfGuys = shuffle(guys);
    const shuffledSecondHalfGirls = shuffle(girls);

    const tableSecondHalfGuys = sortByPosition(shuffledSecondHalfGuys.slice(0, 4));  // Changed from 5 to 4
    const tableSecondHalfRemainingGuys = sortByPosition(shuffledSecondHalfGuys.slice(4, guys.length));  // Changed from 5 to 4
    const tableSecondHalfGirls = sortByPosition(shuffledSecondHalfGirls.slice(0, 2));
    const tableSecondHalfRemainingGirls = sortByPosition(shuffledSecondHalfGirls.slice(2, girls.length));

    setLineup({
      firstHalf: sortByPosition([...tableFirstHalfGuys, ...tableFirstHalfGirls]),
      firstHalfRemainingPeople: sortByPosition([...tableFirstHalfRemainingGuys, ...tableFirstHalfRemainingGirls]),
      secondHalf: sortByPosition([...tableSecondHalfGuys, ...tableSecondHalfGirls]),
      secondHalfRemainingPeople: sortByPosition([...tableSecondHalfRemainingGuys, ...tableSecondHalfRemainingGirls]),
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">NYCFooty Lineup Generator</h1>
      
      {/* Add Load Players button below the title */}


      <p className="text-sm text-gray-500 mb-4">
        This is made for a 7 vs 7 game - min 2 girls per half. Used for the Heat Wave team but can be used for any team.<br />
        <br />
        The input is just for field players (so minimum of 4 guys and 2 girls). <br />
        <br />
        The goalkeepers are not included. <br />
      </p>
      <button
        onClick={handleLoadPlayers}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        Load Heat Wave Players
      </button>
      <button
        onClick={handleClear}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-4 ml-2"
      >
        Clear
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="font-semibold">Guys (one per line. Min 4):</label>
          <textarea
            className="w-full border p-2 px-4 mt-1"
            rows="10"
            value={guysInput}
            onChange={(e) => setGuysInput(e.target.value)}
          ></textarea>
        </div>
  
        <div>
          <label className="font-semibold">Girls (one per line. Min 2):</label>
          <textarea
            className="w-full border p-2 px-4 mt-1"
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