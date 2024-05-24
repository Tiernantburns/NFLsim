import React from 'react';
import useCSVData from '../hooks/useCSVData';

const PlayerStats = ({ csvFilePath }) => {
  const { data: players, headers } = useCSVData(csvFilePath);

  return (
    <div>
      <h2>Player Stats</h2>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              {headers.map((header, index) => (
                <td key={index}>{player[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerStats;
