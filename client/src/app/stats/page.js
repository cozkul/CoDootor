'use client';

import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button, Title, Textarea, Grid, Space, LoadingOverlay, Box } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import TestCases from '@/components/TestCases';
import '@mantine/code-highlight/styles.css';
import styles from './page.module.css';
import { useParams } from 'next/navigation'

const AnswerPage = () => {
  const params = useParams();
  const [loading, setLoading] = useDisclosure(false);
  const [problemTitle, setProblemTitle] = useState('');
  const [givenFunction, setGivenFunction] = useState('');
  const [userInput, setUserInput] = useState('');
  const [ollamaOutput, setOllamaOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [validQuestion, setValidQuestion] = useState(true);
  const questionId = params.qid;

  if (!questionId) return "Invalid page, please visit a valid question.";

//   useEffect(() => {
//     fetch(`http://localhost:5001/question/${questionId}`)
//     .then(resp => {
//       if (resp.ok) return resp;
//       else throw new Error("Invalid question ID.");
//     })
//     .then(resp => resp.json())
//     .then(data => {
//       setGivenFunction(data);
//       setProblemTitle(`Problem ${questionId}`);
//       setValidQuestion(true);
//     })
//     .catch(err => {
//       setValidQuestion(false);
//     })
//   }, [])
// };

  if (!validQuestion) return (<div className={styles.page}>"There was an error fetching the specified question. Please check that the question ID is correct."</div>)

  return (
    <div>
      <div className={styles.page}>
        <div className={styles.header}>
          <Button variant="filled"><a href="../">Home</a></Button>
        </div>

      </div>
    </div>
  );
};

export default AnswerPage;