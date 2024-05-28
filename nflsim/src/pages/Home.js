import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const Home = () => {
  const [players, setPlayers] = useState([]);
  const [team1, setTeam1] = useState({ running: [], passing: [], receiving: [], defense: [] });
  const [team2, setTeam2] = useState({ running: [], passing: [], receiving: [], defense: [] });
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [team1Done, setTeam1Done] = useState(false);
  const [team2Done, setTeam2Done] = useState(false);
  const [showRatings] = useState(false);

  const categoryLimits = {
    running: 1,
    passing: 1,
    receiving: 6,
    defense: 11,
  };

  useEffect(() => {
    fetch('csv/All_NFL_Players.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            const data = result.data.slice(1);
            const playersData = data.map(row => ({
              name: row[Object.keys(row)[0]],
              running: row[Object.keys(row)[2]],  
              passing: row[Object.keys(row)[3]],  
              receiving: row[Object.keys(row)[4]], 
              defense: row[Object.keys(row)[5]], 
            }));
            setPlayers(playersData);
          },
        });
      });
  }, []);

  const handleSearchChange1 = (e) => setSearchTerm1(e.target.value);
  const handleSearchChange2 = (e) => setSearchTerm2(e.target.value);

  const filteredPlayers1 = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm1.toLowerCase())
  ).slice(0, 10);

  const filteredPlayers2 = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm2.toLowerCase())
  ).slice(0, 10);

  const isPlayerAssigned = (playerName) => {
    const isAssignedInTeam1 = Object.values(team1).flat().some(p => p.name === playerName);
    const isAssignedInTeam2 = Object.values(team2).flat().some(p => p.name === playerName);
    return isAssignedInTeam1 || isAssignedInTeam2;
  };

  const removePlayer = (playerName, teamName, category) => {
    if (teamName === 'team1') {
      setTeam1(prevTeam => ({
        ...prevTeam,
        [category]: prevTeam[category].filter(player => player.name !== playerName)
      }));
    } else {
      setTeam2(prevTeam => ({
        ...prevTeam,
        [category]: prevTeam[category].filter(player => player.name !== playerName)
      }));
    }
  };

  const handlePlayerSelect = (player, team, category) => {
    if (isPlayerAssigned(player.name)) {
      alert(`${player.name} is already assigned to a position.`);
      return;
    }
    const newPlayer = { name: player.name, rating: player[category] };

    if (team === 'team1') {
      setTeam1(prevTeam => {
        if (prevTeam[category].length >= categoryLimits[category]) return prevTeam;
        const newTeam = { ...prevTeam, [category]: [...prevTeam[category], newPlayer] };
        checkTeamCompletion(newTeam, 'team1');
        return newTeam;
      });
    } else {
      setTeam2(prevTeam => {
        if (prevTeam[category].length >= categoryLimits[category]) return prevTeam;
        const newTeam = { ...prevTeam, [category]: [...prevTeam[category], newPlayer] };
        checkTeamCompletion(newTeam, 'team2');
        return newTeam;
      });
    }
  };

  const checkTeamCompletion = (team, teamName) => {
    const totalPlayers = Object.values(team).reduce((acc, players) => acc + players.length, 0);
    const totalRequiredPlayers = Object.values(categoryLimits).reduce((acc, limit) => acc + limit, 0);
    if (totalPlayers === totalRequiredPlayers) {
      if (teamName === 'team1') setTeam1Done(true);
      if (teamName === 'team2') setTeam2Done(true);
    }
  };

  const handleAutofill = (team) => {
    const remainingPlayers = players.filter(player => {
      const playerInTeam1 = Object.values(team1).flat().some(p => p.name === player.name);
      const playerInTeam2 = Object.values(team2).flat().some(p => p.name === player.name);
      return !playerInTeam1 && !playerInTeam2;
    });

    const fillTeam = (teamName) => {
      const teamToFill = teamName === 'team1' ? team1 : team2;
      Object.keys(categoryLimits).forEach(category => {
        const remainingSlots = categoryLimits[category] - (teamToFill[category] ? teamToFill[category].length : 0);
        if (remainingSlots > 0) {
          const categoryPlayers = remainingPlayers.filter(player => player[category] !== undefined);
          const randomPlayers = [];
          for (let i = 0; i < remainingSlots; i++) {
            if (categoryPlayers.length === 0) break;
            const randomIndex = Math.floor(Math.random() * categoryPlayers.length);
            randomPlayers.push(categoryPlayers.splice(randomIndex, 1)[0]);
          }
          randomPlayers.forEach(player => handlePlayerSelect(player, teamName, category));
        }
      });
    };

    if (team === 'team1') {
      fillTeam('team1');
    } else {
      fillTeam('team2');
    }
  };

  return (
    <div>
      <h2>Welcome to the NFL Data Simulator</h2>
      <p>Use the navigation to view team and player stats.</p>
      <p>
        Each team should select the following number of players:
        <ul>
          <li>1 Running Back</li>
          <li>1 Quarterback (Passing)</li>
          <li>6 Receivers</li>
          <li>11 Defensive Players</li>
        </ul>
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h3>Team 1</h3>
          <button onClick={() => handleAutofill('team1')}>Autofill Rest of Positions</button>
          <input type="text" value={searchTerm1} onChange={handleSearchChange1} placeholder="Search for players" />
          <ul>
            {searchTerm1 && filteredPlayers1.map((player, index) => (
              <li key={index}>
                {player.name}
                <select onChange={(e) => handlePlayerSelect(player, 'team1', e.target.value)}>
                  <option value="">Select category</option>
                  <option value="running">Running</option>
                  <option value="passing">Passing</option>
                  <option value="receiving">Receiving</option>
                  <option value="defense">Defense</option>
                </select>
              </li>
            ))}
          </ul>
          {team1Done && <button style={{ backgroundColor: 'green', color: 'white' }}>Done</button>}
          <h4>Selected Players</h4>
          <ul>
            {Object.keys(team1).map((category) =>
              team1[category].map((player, index) => (
                <li key={index}>
                  {player.name} - {category} {showRatings && `- Rating: ${player.rating}`}
                  <button onClick={() => removePlayer(player.name, 'team1', category)}>x</button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h3>Team 2</h3>
          <button onClick={() => handleAutofill('team2')}>Autofill Rest of Positions</button>
          <input type="text" value={searchTerm2} onChange={handleSearchChange2} placeholder="Search for players" />
          <ul>
            {searchTerm2 && filteredPlayers2.map((player, index) => (
              <li key={index}>
                {player.name}
                <select onChange={(e) => handlePlayerSelect(player, 'team2', e.target.value)}>
                  <option value="">Select category</option>
                  <option value="running">Running</option>
                  <option value="passing">Passing</option>
                  <option value="receiving">Receiving</option>
                  <option value="defense">Defense</option>
                </select>
              </li>
            ))}
          </ul>
          {team2Done && <button style={{ backgroundColor: 'green', color: 'white' }}>Done</button>}
          <h4>Selected Players</h4>
          <ul>
            {Object.keys(team2).map((category) =>
              team2[category].map((player, index) => (
                <li key={index}>
                  {player.name} - {category} {showRatings && `- Rating: ${player.rating}`}
                  <button onClick={() => removePlayer(player.name, 'team2', category)}>x</button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;


