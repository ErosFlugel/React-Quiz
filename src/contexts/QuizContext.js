import { createContext, useContext, useEffect, useReducer } from 'react';

const QuizContext = createContext();

//Constants
const SECS_PER_QUESTION = 30;

//Initial Values
const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return { ...state, status: 'active', secondsRemaining: state.questions.length * SECS_PER_QUESTION };
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points: question.correctOption === action.payload ? state.points + question.points : state.points,
      };
    case 'nextQuestion':
      return { ...state, index: state.index++, answer: null };
    case 'endResult':
      return {
        ...state,
        status: 'finished',
        highscore: state.points > state.highscore ? state.points : state.highscore,
      };
    case 'restart':
      return { ...initialState, questions: state.questions, status: 'ready', highscore: state.highscore };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };
    default: {
      throw new Error('Unknown Action');
    }
  }
}

function QuizProvider({ children }) {
  const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] = useReducer(
    reducer,
    initialState
  );

  //Derived State
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((acc, question) => question.points + acc, 0);

  const currentQuestion = questions[index];

  //Fetching the questions from a Fake-API
  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch('http://localhost:9000/questions');
        const data = await res.json();
        dispatch({ type: 'dataReceived', payload: data });
      } catch (err) {
        dispatch({ type: 'dataFailed', payload: err.message });
      }
    }
    getData();
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        currentQuestion,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) throw new Error('QuizContext was used outside QuizProvider');
  return context;
}

export { QuizProvider, useQuiz };
