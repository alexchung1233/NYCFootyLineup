import React, { useState } from "react";
import playersData from './heat-wave-players.json';
import './SoccerLineup.css';

export default function SoccerLineup() {

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
    let num_current_attackers = attackers.length;
    let num_current_defenders = defenders.length;
    
    while (num_current_attackers > 3 && attackers.length > 0) {  // Added check for attackers.length
      // get random attacker
      const randomIndex = Math.floor(Math.random() * attackers.length);
      let randomAttacker = attackers[randomIndex];
      
      // remove attacker from attackers
      attackers.splice(randomIndex, 1);
      
      // change role to defender
      randomAttacker = randomAttacker.replace("- Attacker", "- Defender");
      
      // add modified attacker to defenders
      defenders.push(randomAttacker);
      
      // update num_current_attackers
      num_current_attackers--;
    }
    
    while (num_current_defenders > 3 && defenders.length > 0) {  // Added check for defenders.length
      // get random defender
      const randomIndex = Math.floor(Math.random() * defenders.length);
      let randomDefender = defenders[randomIndex];
      
      // remove defender from defenders
      defenders.splice(randomIndex, 1);
      
      // change role to attacker
      randomDefender = randomDefender.replace("- Defender", "- Attacker");
      
      // add modified defender to attackers
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

    const tableFirstHalfBalanced = balancePositions([...tableFirstHalfGuys, ...tableFirstHalfGirls]);

    const shuffledSecondHalfGuys = shuffle(guys);
    const shuffledSecondHalfGirls = shuffle(girls);

    const tableSecondHalfGuys = sortByPosition(shuffledSecondHalfGuys.slice(0, 4));  // Changed from 5 to 4
    const tableSecondHalfRemainingGuys = sortByPosition(shuffledSecondHalfGuys.slice(4, guys.length));  // Changed from 5 to 4
    const tableSecondHalfGirls = sortByPosition(shuffledSecondHalfGirls.slice(0, 2));
    const tableSecondHalfRemainingGirls = sortByPosition(shuffledSecondHalfGirls.slice(2, girls.length));

    const tableSecondHalfBalanced = balancePositions([...tableSecondHalfGuys, ...tableSecondHalfGirls]);

    setLineup({
      firstHalf: sortByPosition(tableFirstHalfBalanced),
      firstHalfRemainingPeople: sortByPosition([...tableFirstHalfRemainingGuys, ...tableFirstHalfRemainingGirls]),
      secondHalf: sortByPosition(tableSecondHalfBalanced),
      secondHalfRemainingPeople: sortByPosition([...tableSecondHalfRemainingGuys, ...tableSecondHalfRemainingGirls]),
    });
  };

  return (
    <div className="container">
      <div className="main-content">
        <h1 className="text-2xl font-bold mb-4">NYCFooty Lineup Generator</h1>
        
        <p className="text-sm text-gray-500 mb-4">
          This is made for a 7 vs 7 game - min 2 girls per half. Used for the Heat Wave team but can be used for any team.<br />
          <br />
          The input is just for field players (so minimum of 4 guys and 2 girls). <br />
          <br />
          The goalkeepers are not included. Players with "ANYTHING" role are randomly assigned to defenders or attackers. <br />
        </p>

        <div className="mb-4">
          <button onClick={handleLoadPlayers} className="button button-success mr-2">
            Load Heat Wave Players
          </button>
          <button onClick={handleClear} className="button button-danger">
            Clear
          </button>
        </div>

        <div className="input-area">
          <div>
            <label className="font-semibold">Guys (one per line. Min 4):</label>
            <textarea
              className="textarea"
              value={guysInput}
              onChange={(e) => setGuysInput(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="font-semibold">Girls (one per line. Min 2):</label>
            <textarea
              className="textarea"
              value={girlsInput}
              onChange={(e) => setGirlsInput(e.target.value)}
            ></textarea>
          </div>
        </div>

        <button onClick={handleGenerate} className="button button-primary">
          Generate Lineup
        </button>

        {lineup && (
          <div className="mt-4 space-y-4">
            {/* First row: First Half and Second Half */}
            <div className="lineup-grid">
              <div>
                <h2 className="lineup-header">First Half Players</h2>
                <div className="table-container">
                  <table className="lineup-table">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineup.firstHalf.map((player, idx) => {
                        const [name, position] = player.split(" - ");
                        return (
                          <tr key={idx}>
                            <td>{name}</td>
                            <td>{position}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h2 className="lineup-header">Second Half Players</h2>
                <div className="table-container">
                  <table className="lineup-table">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineup.secondHalf.map((player, idx) => {
                        const [name, position] = player.split(" - ");
                        return (
                          <tr key={idx}>
                            <td>{name}</td>
                            <td>{position}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Second row: Remaining Players for both halves */}
            <div className="lineup-grid">
              <div>
                <h2 className="lineup-header">First Half Remaining Players</h2>
                <div className="table-container">
                  <table className="lineup-table">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineup.firstHalfRemainingPeople.map((player, idx) => {
                        const [name, position] = player.split(" - ");
                        return (
                          <tr key={idx}>
                            <td>{name}</td>
                            <td>{position}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h2 className="lineup-header">Second Half Remaining Players</h2>
                <div className="table-container">
                  <table className="lineup-table">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineup.secondHalfRemainingPeople.map((player, idx) => {
                        const [name, position] = player.split(" - ");
                        return (
                          <tr key={idx}>
                            <td>{name}</td>
                            <td>{position}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="footer">
        Created by Alex Chung (awchung1357@gmail.com)
      </footer>
    </div>
  );
}