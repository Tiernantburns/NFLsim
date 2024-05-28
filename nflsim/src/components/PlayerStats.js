import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const PlayerStats = ({ csvFilePath }) => {
  const[data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    if (csvFilePath) {
      fetch(csvFilePath)
        .then(response => response.text())
        .then(csvText => {
          Papa.parse(csvText, {
            header: true, // Parse without considering the first row as header
            complete: (result) => {
              setHeaders(Object.keys(result.data[0]));
              const filteredData = result.data.slice(1).map(row => ({
                col1: row[Object.keys(row)[0]],
                col2: row[Object.keys(row)[1]],
                col3: row[Object.keys(row)[2]],
                col4: row[Object.keys(row)[3]],
                col5: row[Object.keys(row)[4]],
                col6: row[Object.keys(row)[5]],
              }));
              setData(filteredData);
            },
          });
        });
    }
  }, [csvFilePath]);


  return (
    <div>
      <h3>Player Stats</h3>
      <table>
      <thead>
          <tr>
            {headers.slice(0, 6).map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.col1}</td>
              <td>{row.col2}</td>
              <td>{row.col3}</td>
              <td>{row.col4}</td>
              <td>{row.col5}</td>
              <td>{row.col6}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerStats;
