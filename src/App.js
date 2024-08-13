import './App.css';
import missions from './Missions';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique IDs

// Function to get a specified number of random missions
const getRandomMissions = (allMissions, numberOfMissions) => {
  if (allMissions.length <= numberOfMissions) return allMissions; // Avoid exceeding length
  const shuffled = [...allMissions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numberOfMissions);
};

function App() {
  const [missionsList, setMissionsList] = useState([]);
  const requiredToWin = 3; // Number of missions required to win

  useEffect(() => {
    const initialMissions = getRandomMissions(missions, 5);
    setMissionsList(initialMissions.map(mission => ({
      id: uuidv4(),
      description: mission,
      completed: false,
      voided: false,
    })));
  }, []);

  const toggleCompleted = (id) => {
    setMissionsList(missionsList.map(mission => 
      mission.id === id
        ? { ...mission, completed: !mission.completed }
        : mission
    ));
  };

  const toggleVoided = (id) => {
    setMissionsList(missionsList.map(mission => 
      mission.id === id
        ? { ...mission, voided: !mission.voided, completed: false }
        : mission
    ));
  };

  const checkIfWon = () => {
    const completedCount = missionsList.filter(mission => mission.completed && !mission.voided).length;
    return completedCount >= requiredToWin;
  };

  return (
    <div className="App">
      <h1>Gaslit</h1>
      <div className="checkbox-headers">
        <div className="checkbox-header">Completed</div>
        <div className="checkbox-header">Mission</div>
        <div className="checkbox-header">Caught</div>
      </div>
      <ul className="mission-list">
        {missionsList.map(mission => (
          <li
            key={mission.id}
            className={`mission-item ${mission.completed ? 'completed' : ''} ${mission.voided ? 'voided' : ''}`}
          >
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id={`complete-${mission.id}`}
                checked={mission.completed}
                onChange={() => toggleCompleted(mission.id)}
                aria-label={`Complete Mission: ${mission.description}`}
                disabled={mission.voided} // Disable completion checkbox if voided
              />
            </div>
            <span className="mission-description">{mission.description}</span>
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id={`void-${mission.id}`}
                checked={mission.voided}
                onChange={() => toggleVoided(mission.id)}
                aria-label={`Void Mission: ${mission.description}`}
                disabled={mission.completed} // Disable void checkbox if completed
              />
            </div>
          </li>
        ))}
      </ul>
      {checkIfWon() && <h2>You won the game!</h2>}
    </div>
  );
}

export default App;
