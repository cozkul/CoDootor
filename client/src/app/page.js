import React from 'react';
import HomeButton from './components/HomeButton';
import ProblemTitle from './components/ProblemTitle';
import FunctionDisplay from './components/FunctionDisplay';
import TestCases from './components/TestCases';
import OllamaOutput from './components/OllamaOutput';
import UserInput from './components/UserInput';
import SubmitButton from './components/SubmitButton';
import styles from './page.module.css';

const AnswerPage = () => {
  return (
    <div>
      <div className={styles.page}>
        <div className={styles.header}>
          <HomeButton />
        </div>
        <ProblemTitle />
        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <FunctionDisplay />
          </div>
          <div className={styles.centerColumn}>
            <TestCases />
          </div>
          <div className={styles.rightColumn}>
            <OllamaOutput />
          </div>
        </div>
        <UserInput />
        <SubmitButton />
      </div>
    </div>
  );
};

export default AnswerPage;
