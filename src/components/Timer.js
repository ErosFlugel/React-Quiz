import { useEffect } from 'react';
import { useQuiz } from '../contexts/QuizContext';

function Timer() {
  const { dispatch, secondsRemaining } = useQuiz();

  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  useEffect(() => {
    //The returned value of an interval is the ID that we can use later to handle it
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);

    //We want to cancel the timer once the component has been unmounted and since it is an async task we need to do it manually setting a clousure in the useEffect
    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <div className='timer'>
      {mins < 10 && '0'}
      {mins}:{seconds < 10 && '0'}
      {seconds}
    </div>
  );
}

export default Timer;
