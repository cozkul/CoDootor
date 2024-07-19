'use client';

import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button, Title, Textarea, Grid, Space, LoadingOverlay, Box } from '@mantine/core';
import HomeButton from '@/components/HomeButton'
import { CodeHighlight } from '@mantine/code-highlight';
import TestCases from '@/components/TestCases';
import '@mantine/code-highlight/styles.css';
import styles from './page.module.css';
import { useParams } from 'next/navigation'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useUser } from '@auth0/nextjs-auth0/client';
import GetUser from "@/util/GetUser";
import AttemptsList from '@/components/AttemptsList';


export default withPageAuthRequired(function AnswerPage() {
  const params = useParams();
  const [loading, setLoading] = useDisclosure(false);
  const [problemTitle, setProblemTitle] = useState('');
  const [givenFunction, setGivenFunction] = useState('');
  const [userInput, setUserInput] = useState('');
  const [ollamaOutput, setOllamaOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [validQuestion, setValidQuestion] = useState(true);
  const questionId = params.qid;
  const { user, error, isLoading } = useUser();
  const [unlocked, setUnlocked] = useState(true);
  const [token, setToken] = useState(null);
  const [attempts, setAttempts] = useState([]);

  if (!questionId) return (<div>"Invalid page, please visit a valid question.";</div>);

  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      try {
        const response = await fetch('http://localhost:5173/api/token');
        const data = await response.json();
        setToken(data.token);
        const sessionInfo = {};
        sessionInfo['user'] = user;
        const userData = await GetUser(data.token);
        const userScores = userData.questions_solved;
        const previous_score = (questionId > 1) ? userScores[questionId - 1] : 1;
        if (previous_score === 0 || previous_score == null) {
          setUnlocked(false);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    fetchTokenAndUserData();
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5001/question/${questionId}`)
    .then(resp => {
      if (resp.ok) return resp;
      else throw new Error("Invalid question ID.");
    })
    .then(resp => resp.json())
    .then(data => {
      setGivenFunction(data);
      setProblemTitle(`Problem ${questionId}`);
      setValidQuestion(true);
    })
    .catch(err => {
      setValidQuestion(false);
    })
  }, [])

  useEffect(() => {
    fetch(`http://localhost:5001/unit_tests/${questionId}`)
    .then(resp => {
      if (resp.ok) return resp;
      else throw new Error("Unit tests could not be fetched.");
    })
    .then(resp => resp.json())
    .then(data => {
      setTestResults(data);
    })
  }, [])

  const handleSubmit = async () => {
    setLoading.open();
    try {
      const testResponse = await fetch('http://localhost:5001/grade', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: questionId, desc: userInput}),
      });
      const testData = await testResponse.json();
      setOllamaOutput(testData.llm_code);
      setTestResults(testData.results);

      // Adding the attempt to user data, fetching data
      // need to reloead...?
      const attemptData = {
        id: questionId,
        desc: userInput,
        results: testData.results
      };

      await fetch(`http://localhost:5001/user/${user.sub.split('|')[1]}/attempts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attemptData),
      });

      const fetchAttempts = async () => {
        try {
          const res = await fetch('/api/token');
          const { token } = await res.json();
          const response = await fetch(`http://localhost:5001/user/${user.sub.split('|')[1]}/attempts`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          const data = await response.json();
          const filteredAttempts = data.filter(attempt => attempt.id === questionId);
          setAttempts(filteredAttempts);
        } catch (error) {
            console.error("Failed to fetch attempts:", error);
        }
      };

      fetchAttempts();

    } catch (error) {
      console.error(error);
    } finally {
      setLoading.close();
      //window.location.reload();
    }
  };

  const populateAnswerFields = async (data) => {
    const llm_resp = await fetch('http://localhost:5001/code', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"desc": data.desc})
    })
    .then(resp => resp.json())
    .catch(err => {
      return {"llm_code": "ERROR retrieving code from Ollama"}
    });

    console.log(llm_resp);

    setTestResults(data.results);
    setUserInput(data.desc);
    setOllamaOutput(llm_resp.llm_code);
  }

  if (!validQuestion) return (<div className={styles.page}>"There was an error fetching the specified question. Please check that the question ID is correct."</div>)
  if (!unlocked) return (<div className={styles.page}>Question not yet unlocked. Please return to homepage.</div>);
  if (isLoading) return ("Loading...");

  return (
    <div>
      <div className={styles.page}>
        <div className={styles.header}>
          <HomeButton></HomeButton>
        </div>
        <Title order={1}>{problemTitle}</Title>
        <Grid grow>
          <Grid.Col span={4}>
            <Title order={2}>Given Function</Title>
            <CodeHighlight withCopyButton={false} code={givenFunction} language="javascript" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={2}>Test Cases</Title>
            <TestCases testResults={testResults} setTestResults={setTestResults} />
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={2}>Ollama Output</Title>
            <CodeHighlight withCopyButton={false} code={ollamaOutput} language="javascript" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Box pos="relative">
              <Textarea
                label="User Input"
                description="Description for Given Function"
                placeholder="Please enter the description for given function."
                value={userInput}
                disabled={loading}
                required
                error={ !userInput ? "Description cannot be empty." : null }
                onChange={(event) => setUserInput(event.currentTarget.value)}
              />
            </Box>
            <Space h="md" />
            <Button disabled={loading || !userInput} fullWidth variant="filled" onClick={handleSubmit} loading={loading}>Submit</Button>
          </Grid.Col>
        </Grid>
        <div>
          <Title>Previous Attempts</Title>
        </div>
        <Grid>
          <Grid.Col span={12}>
            <AttemptsList questionID={questionId} callback={populateAnswerFields}></AttemptsList>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
});