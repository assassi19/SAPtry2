import React from 'react';

const Leaderboard = ({ players }) => {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score).slice(0, 3);

    return (
        <div className="leaderboard-container">
            <h2>Leaderboard</h2>
            <ul>
                {sortedPlayers.map((player, index) => (
                    <li key={player.id}>
                        {index + 1}. {player.name} - {player.score} points
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
