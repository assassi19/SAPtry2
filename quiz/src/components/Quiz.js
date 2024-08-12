import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Question from "./Question";
import Answer from "./Answer";
import Leaderboard from "./Leaderboard";

const socket = io('http://localhost:3001');

const Quiz = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [players, setPlayers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(15); // Timer for each question
    const [playerName, setPlayerName] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);

    const questions = [
        {
            question: "TA team is known as?",
            answers: ["Talent Attraction", "Talent Acquisition", "Talent actualisation", "Talent Advisors"],
            correctAnswer: "Talent Acquisition",
        },
        {
            question: 'What does RUN stand for in Best Run?',
            answers: ["Renew, Upgrade and no outages", "Revive, upgrade & no outages", "Review, update & no outbreaks", "Renew, upgrade & no outlook"],
            correctAnswer: "Renew, Upgrade and no outages",
        },
        {
            question: "How many Labs offices does SAP have across the globe?",
            answers: ["20", "30", "18", "15"],
            correctAnswer: "20",
        },
        {
            question: "What is the unique, hands-on development opportunity for SAP Employees, typically ranging from 1-6 months?",
            answers: ["Fellowship", "Mentorship", "SAP IXP Program", "Internship"],
            correctAnswer: "Fellowship",
        },
        {
            question: "What is the headcount of SAP Labs India?",
            answers: ["14000", "15000", "16000", "18000"],
            correctAnswer: "14000",
        },
        {
            question: "What is our internship program called?",
            answers: ["Sales Academy", "Scholar Hiring program", "iXP - Internship Experience Program", "Vocational Training"],
            correctAnswer: "iXP - Internship Experience Program",
        },
        {
            question: "How many generations of workforce do we have?",
            answers: ["5 generations", "4 generations", "3 generations", "2 generations"],
            correctAnswer: "5 generations",
        },
        {
            question: "Which one of the world's most popular global sports teams uses SAP Solutions?",
            answers: ["NBA", "Manchester United", "ACB", "BCCI"],
            correctAnswer: "NBA",
        },
        {
            question: "Which world-famous music band uses SAP solutions?",
            answers: ["Coldplay", "Greenday", "BTS", "Pink Floyd"],
            correctAnswer: "Coldplay",
        },
        {
            question: "What does SAP stand for?",
            answers: ["Systems, Applications and Products in Data Processing", "Storage, Applications and Products in Data Processing", "Systems, Appliances and Products in Data Processing", "Storage, Applications and Performance in Data Processing"],
            correctAnswer: "Systems, Applications and Products in Data Processing",
        },
    ];


      
    // Handles joining the game and updating players
    useEffect(() => {
        if (isGameStarted) {
         const socket = io('http://localhost:3001', {
            transports: ['polling', 'websocket'],
            withCredentials: true, // This helps with CORS issues by sending credentials
         });
            socket.emit('joinGame', playerName); // Emit player's name when game starts
            socket.on('playersUpdate', (players) => {
                setPlayers(players);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [isGameStarted, playerName]); // Added playerName to the dependency array

    // Handles the timer countdown
    useEffect(() => {
        if (timeLeft > 0 && isGameStarted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && isGameStarted) {
            handleNextQuestion();
        }
    }, [timeLeft, isGameStarted]);

    const startGame = () => {
        setIsGameStarted(true);
    };

    const handleAnswer = (answer) => {
        if (answer === questions[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
            socket.emit('submitAnswer', { score: 1 });
        } else {
            socket.emit('submitAnswer', { score: 0 });
        }

        handleNextQuestion();
    };

    const handleNextQuestion = () => {
        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < questions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
            setTimeLeft(15);
        } else {
            setIsQuizFinished(true);
        }
    };

    return (
        <div className="quiz-container">
            {!isGameStarted ? (
                <div className="start-container">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                    />
                    <button onClick={startGame}>Start Game</button>
                </div>
            ) : !isQuizFinished && questions[currentQuestionIndex] ? (
                <>
                    <Question question={questions[currentQuestionIndex].question} />
                    <div className="answers-container">
                        {questions[currentQuestionIndex].answers.map((answer, index) => (
                            <Answer key={index} answer={answer} onSelectAnswer={handleAnswer} />
                        ))}
                    </div>
                    <div className="timer">Time left: {timeLeft} seconds</div>
                </>
            ) : (
                <Leaderboard players={players} />
            )}
        </div>
    );
};

export default Quiz;
