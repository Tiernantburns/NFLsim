import React, { useState } from 'react';
import PlayerStats from '../components/PlayerStats';

const Players = () => {
  const [csvFilePath, setCsvFilePath] = useState(null);

  const handleButtonClick = (path) => {
    setCsvFilePath(path);
  };

  return (
    <div>
      <h2>Players</h2>
      <div>
        <button onClick={() => handleButtonClick('csv/NFL_Rushing_Player_Ratings_-_Adjusted_for_Fumbles.csv')}>
          Rushing Stats
        </button>
        <button onClick={() => handleButtonClick('csv/NFL_Passing_Player_Ratings_-_Adjusted_for_Sacks.csv')}>
          Passing Stats
        </button>
        <button onClick={() => handleButtonClick('csv/NFL_Rushing_Player_Ratings_-_Adjusted_for_Fumbles.csv')}>
          Receiving Stats
        </button>
      </div>
      {csvFilePath && <PlayerStats csvFilePath={csvFilePath} />}
    </div>
  );
};

export default Players;
