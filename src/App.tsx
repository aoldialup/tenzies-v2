import { useState, useEffect } from 'react';
import './App.css';
import { Die } from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

const DIE_MIN = 1;
const DIE_MAX = 6;
const NUM_DIES = 10;

interface DieData {
  value: number,
  isHeld: boolean,
  id: string
}

function allNewDice(): DieData[] {
  let dice: DieData[] = [];

  for (let i: number = 0; i < NUM_DIES; i++) {
    dice.push(genNewDie());
  }

  return dice;
}

function genNewDie(): DieData {
  return {
    value: Math.floor(Math.random() * DIE_MAX) + DIE_MIN,
    isHeld: false,
    id: nanoid()
  }
}

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [isGameOver, setGameOver] = useState(false);
  const [rollsDone, setRollsDone] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (hasUserWon()) {
      setGameOver(true);
      setIsPlaying(false);

      const bestTime = localStorage.getItem("bestTime");
      if (bestTime === null || seconds < parseInt(bestTime)) {
        localStorage.setItem("bestTime", JSON.stringify(seconds));
      }
    }
  }, [dice]);

  useEffect(() => {
    if (isPlaying) {
      let timeCounter = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);

      return () => clearInterval(timeCounter);
    }
  }, [isPlaying]);

  function hasUserWon(): boolean {
    return dice.every(die => die.value === dice[0].value && die.isHeld);
  }

  function roll(): void {
    if (!isGameOver) {
      setDice((prevDice) => prevDice.map(die => die.isHeld ? die : genNewDie()));
      setRollsDone(rollsDone => rollsDone + 1);

      if (!isPlaying) {
        setIsPlaying(true);
        setSeconds(0);
      }
    }
    else {
      setGameOver(false);
      setDice(allNewDice());
      setRollsDone(0);
      setIsPlaying(true);
      setSeconds(0);
    }
  }

  function holdDice(id: string): void {
    if (!isGameOver) {
      setDice(oldDice => oldDice.map(die => die.id === id ? { ...die, isHeld: !die.isHeld } : die));

      if (!isPlaying) {
        setIsPlaying(true);
      }
    }
  }

  return (
    <main className='tenzies'>
      {isGameOver && <Confetti width={550} height={520} />}
      <h1 className='title'>Tenzies</h1>
      <p className='instructions'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls</p>
      <h2>Rolls done: {rollsDone}</h2>
      <h2>{seconds}</h2>
      <div className='dice-container'>
        {dice.map(die => <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />)}
      </div>
      <button className='roll-dice' onClick={roll}>{isGameOver ? "New Game" : "Roll"}</button>
    </main>
  );
}

export default App;