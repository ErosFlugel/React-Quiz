import { useQuiz } from '../contexts/QuizContext';

function Options({ currentQuestion }) {
  const { dispatch, answer } = useQuiz();

  const hasAnswered = answer !== null;
  return (
    <div className='options'>
      {currentQuestion.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? 'answer' : ''} ${
            hasAnswered ? (index === currentQuestion.correctOption ? 'correct' : 'wrong') : ''
          }`}
          key={option}
          //We disabled the buttons once an answer has been set
          disabled={hasAnswered}
          onClick={() => dispatch({ type: 'newAnswer', payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
