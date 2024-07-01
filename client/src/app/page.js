import React from 'react';
import { Button } from '@mantine/core';
import { Title } from '@mantine/core';
import { Code } from '@mantine/core';
import TestCases from '../components/TestCases';
import { Textarea } from '@mantine/core';
import styles from './page.module.css';

const demo = `
import { Code } from '@mantine/core';

function Demo() {
  return <Code>React.createElement()</Code>;
}`;

const AnswerPage = () => {
  return (
    <div>
      <div className={styles.page}>
        <div className={styles.header}>
        <Button variant="filled">Home</Button>
        </div>
        <Title order={1}>Problem title</Title>
        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <Title order={2}>Given Function</Title>
            <Code block>{demo}</Code>
          </div>
          <div className={styles.centerColumn}>
            <Title order={2}>Test Cases</Title>
            <TestCases />
          </div>
          <div className={styles.rightColumn}>
            <Title order={2}>Ollama Output</Title>
            <Code block>{demo}</Code>
          </div>
        </div>
        <Textarea
          label="User Input"
          description="Description for Given Function"
          placeholder="Please enter the description for given function."
        />
        <Button variant="filled">Submit</Button>
      </div>
    </div>
  );
};

export default AnswerPage;
