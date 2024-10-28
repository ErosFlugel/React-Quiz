import { useQuiz } from '../contexts/QuizContext';

function NextButton() {
  const { dispatch, answer, numQuestions, index } = useQuiz();

  if (answer === null) return null;

  const questNumber = numQuestions - 1 === index;

  return (
    <button
      className='btn btn-ui'
      onClick={() => dispatch({ type: questNumber ? 'endResult' : 'nextQuestion' })}
    >
      {questNumber ? 'Finish' : 'Next'}
    </button>
  );
}

export default NextButton;
