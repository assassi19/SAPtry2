import React from 'react';

const Question = ({ question }) => {
    return (
        <div className="question-container">
            <h2>{question}</h2>
        </div>
    );
};

export default Question;
