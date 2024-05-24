import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const PlayerStats = () => {
  const [players, setPlayers] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    // Fetch the CSV file
    fetch('csv/NFL_Rushing_Player_Ratings_-_Adjusted_for_Fumbles.csv')
      .then(response => response.text())
      .then(csvText => {
        // Parse the CSV file
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            setPlayers(results.data);
            setHeaders(results.meta.fields);
          },
          error: (error) => {
            console.error('Error parsing CSV file:', error);
          }
        });
      })
      .catch(error => console.error('Error fetching CSV file:', error));
  }, []);

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
