import React, { useEffect, useState } from 'react';
import './local-toss.css';

export default function Toss({ player1Name, player2Name, setTossWinner }) {
  const [winner, setWinner] = useState('');
  const [isTossing, setIsTossing] = useState(false);

  const handleToss = () => {
    setIsTossing(true);
    setTimeout(() => {
      const randomWinner = Math.random() < 0.5 ? player1Name : player2Name;
      setWinner(randomWinner);
      setIsTossing(false);
    }, 2000);
  };

  useEffect(()=>{
    setTimeout(()=>{
        setTossWinner(winner)
    },1000);
  },[winner])

  return (
    <div className="toss-container">
      <h2>Toss to decide who starts first</h2>
      {winner ? (
        <div className="toss-result">
          <h3>{winner} wins the toss!</h3>
          <div className="coin final">
            {winner === player1Name ? '1' : '2'}
          </div>
        </div>
      ) : (
        <div className="toss-action">
          <button onClick={handleToss} disabled={isTossing}>
            {isTossing ? 'Tossing...' : 'Toss Now'}
          </button>
          {isTossing && (
            <div className="coin toss-animation">
              <span>Toss</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
