import React from 'react';

const Answer = ({ answer, onSelectAnswer }) => {
    return (
        <button className="answer-button" onClick={() => onSelectAnswer(answer)}>
            {answer}
        </button>
    );
};

export default Answer;
