import { useQuiz } from '../contexts/QuizContext';
import Options from './Options';

function Question() {
  const { currentQuestion } = useQuiz();

  return (
    <div>
      <h4>{currentQuestion.question}</h4>
      <Options />
    </div>
  );
}

export default Question;
