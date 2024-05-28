import React, { useState } from 'react';
import PlayerStats from '../components/PlayerStats';

const Players = () => {
  const [csvFilePath, setCsvFilePath] = useState(null);

  const handleCSV = () => {
    setCsvFilePath('csv/All_NFL_Players.csv');
  };

  return (
    <div>
      <h2>Players</h2>
      <div>
        <button onClick={() => handleCSV()}>
          Load Stats
        </button>
      </div>
      {csvFilePath && <PlayerStats csvFilePath={csvFilePath} />}
    </div>
  );
};

export default Players;
