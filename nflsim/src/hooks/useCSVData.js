import { useEffect, useState } from 'react';
import Papa from 'papaparse';

const useCSVData = (csvFilePath) => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    // Fetch the CSV file
    fetch(csvFilePath)
      .then(response => response.text())
      .then(csvText => {
        // Parse the CSV file
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            setData(results.data);
            setHeaders(results.meta.fields);
          },
          error: (error) => {
            console.error('Error parsing CSV file:', error);
          }
        });
      })
      .catch(error => console.error('Error fetching CSV file:', error));
  }, [csvFilePath]);

  return { data, headers };
};

export default useCSVData;
