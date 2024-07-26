'use client';

import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button, Title, Textarea, Grid, Space, Notification, Box, Divider } from '@mantine/core';
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
  const questionID = params.qid;
  const { user, error, isLoading } = useUser();
  const [unlocked, setUnlocked] = useState(true);
  const [token, setToken] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [userInputFirst, setUserInputFirst] = useState(false);
  const [userCommentFirst, setUserCommentFirst] = useState(false);
  const [attempts, setAttempts] = useState([]);

  if (!questionID) return (<div>"Invalid page, please visit a valid question.";</div>);

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
        const previous_score = (questionID > 1) ? userScores[questionID - 1] : 1;
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
    fetch(`http://localhost:5001/question/${questionID}`)
    .then(resp => {
      if (resp.ok) return resp;
      else throw new Error("Invalid question ID.");
    })
    .then(resp => resp.json())
    .then(data => {
      setGivenFunction(data);
      setProblemTitle(`Problem ${questionID}`);
      setValidQuestion(true);
    })
    .catch(err => {
      setValidQuestion(false);
    })
  }, [])

  useEffect(() => {
    fetch(`http://localhost:5001/unit_tests/${questionID}`)
    .then(resp => {
      if (resp.ok) return resp;
      else throw new Error("Unit tests could not be fetched.");
    })
    .then(resp => resp.json())
    .then(data => {
      setTestResults(data);
    })
  }, [])

  useEffect(() => {
    fetchAttempts();
  })

  const fetchAttempts = async () => {
    try {
        const res = await fetch('http://localhost:5173/api/token');
        const { token } = await res.json();
        const response = await fetch(`http://localhost:5001/question/${questionID}/attempts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        setAttempts(data);
    } catch (error) {
        console.error("Failed to fetch attempts:", error);
    }
};

  const handleSubmit = async () => {
    setUserCommentFirst(true);
    setUserInputFirst(true);
    if (userInput === "") return;
    setLoading.open();
    try {
      const testResponse = await fetch('http://localhost:5001/grade', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: questionID, desc: userInput, comment: commentInput}),
      });
      const testData = await testResponse.json();
      setOllamaOutput(testData.llm_code);
      setTestResults(testData.results);
      fetchAttempts();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading.close();
    }
  };

  const populateAnswerFields = async (data) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading.open();
    const llm_resp = await fetch('http://localhost:5001/code', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"desc": data.desc})
    })
    .then(resp => resp.json())
    .catch(err => {
      return {"llm_code": "ERROR retrieving code from Ollama"}
    });

    setTestResults(data.results);
    setUserInput(data.desc);
    setOllamaOutput(llm_resp.llm_code);

    setLoading.close();
  }

  if (!validQuestion) return (<div className={styles.page}>"There was an error fetching the specified question. Please check that the question ID is correct."</div>)
  if (!unlocked) return (<div className={styles.page}>Question not yet unlocked. Please return to homepage.</div>);
  if (isLoading) return ("Loading...");

  return (
    <div>
      <div className={styles.page}>
        <div className={styles.header}>
          <HomeButton></HomeButton>
          {loading ? 
          <Notification loading withCloseButton={false} title="Generating Code">
            Please wait while we fetch the LLM code.
          </Notification> : null}
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
            <CodeHighlight withCopyButton={false} code={ollamaOutput} loading={loading ? 1 : undefined} language="javascript" />
          </Grid.Col>
          <Grid.Col span={8}>
            <Box pos="relative">
            <Textarea
                label="User Input"
                description="Description for Given Function"
                placeholder="Please enter the description for given function."
                value={userInput}
                disabled={loading}
                required
                error={ !userInput && userInputFirst ? "Description cannot be empty." : null }
                onChange={(event) => { setUserInput(event.currentTarget.value); setUserInputFirst(true); }}
              />
            </Box>
          </Grid.Col>
          <Grid.Col span={4}>
            <Box pos="relative">
              <Textarea
                label=" "
                description="Optional comment"
                placeholder="Please enter a brief rationale for the changes made to your previous submission."
                value={commentInput}
                disabled={loading}
                required
                error={ !commentInput && userCommentFirst ? "Comment cannot be empty." : null }
                onChange={(event) => { setCommentInput(event.currentTarget.value); setUserCommentFirst(true); }}
              />
            </Box>
          </Grid.Col>
          <Grid.Col span={12}>
            <Button disabled={loading } fullWidth variant="filled" onClick={handleSubmit} loading={loading ? 1 : undefined}>Submit</Button>
          </Grid.Col>
        </Grid>
        <Divider my="md"></Divider>
        <div>
          <Title order={2}>Previous Attempts</Title>
        </div>
        <Divider my="md"></Divider>
        <AttemptsList callback={populateAnswerFields} attempts={attempts}></AttemptsList>
        <Divider my="xl"></Divider>
      </div>
    </div>
  );
});