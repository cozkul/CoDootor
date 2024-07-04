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
  const [visible, handlers] = useDisclosure(false);
  const [problemTitle, setProblemTitle] = useState('');
  const [givenFunction, setGivenFunction] = useState('');
  const [userInput, setUserInput] = useState('');
  const [ollamaOutput, setOllamaOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [validQuestion, setValidQuestion] = useState(true);
  const questionId = params.qid;

  if (!questionId) return "Invalid page, please visit a valid question.";

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

  // useEffect(() => {
  //   console.log("questionId ID:", questionId);
  //   if (questionId) {
  //     // retrieve questions
  //     fetch(`http://localhost:5001/question/${questionId}`)
  //       .then((response) => response.text())
  //       .then((data) => {
  //         setGivenFunction(data);
  //         setProblemTitle(`Problem ${questionId}`);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching question code:', error);
  //       });
  //   }
  // }, [questionId]);

  const handleSubmit = async () => {
    handlers.open();
    try {
      // const response = await fetch('http://localhost:5001/code', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ desc: userInput }),
      // });
      // const data = await response.json();
      const testResponse = await fetch('http://localhost:5001/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: questionId, desc: userInput }),
      });
      const testData = await testResponse.json();
      setOllamaOutput(testData.llm_code);
      setTestResults(testData.results);
    } catch (error) {
      console.error(error);
    } finally {
      handlers.close();
    }
  };

  if (!validQuestion) return (<div>"There was an error fetching the specified question. Please check that the question ID is correct."</div>)

  return (
    <div>
      <div className={styles.page}>
        <div className={styles.header}>
          <Button variant="filled"><a href="../">Home</a></Button>
        </div>
        <Title order={1}>{problemTitle}</Title>
        <Grid grow>
          <Grid.Col span={4}>
            <Title order={2}>Given Function</Title>
            <CodeHighlight withCopyButton={false} code={givenFunction} language="javascript" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={2}>Test Cases</Title>
            <TestCases results={testResults} />
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={2}>Ollama Output</Title>
            <CodeHighlight withCopyButton={false} code={ollamaOutput} language="javascript" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Box pos="relative">
              <LoadingOverlay
                visible={visible}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'pink', type: 'bars' }}
              />
              <Textarea
                label="User Input"
                description="Description for Given Function"
                placeholder="Please enter the description for given function."
                value={userInput}
                onChange={(event) => setUserInput(event.currentTarget.value)}
              />
            </Box>
            <Space h="md" />
            <Button fullWidth variant="filled" onClick={handleSubmit}>Submit</Button>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
};

export default AnswerPage;

// 'use client'

// import React from 'react';
// import { useDisclosure } from '@mantine/hooks';
// import { Button, Title, Textarea, Grid, Space, LoadingOverlay, Box } from '@mantine/core';
// import { CodeHighlight } from '@mantine/code-highlight';
// import TestCases from '../../components/TestCases';

// import '@mantine/code-highlight/styles.css';
// import styles from './page.module.css';

// const demo = `
// import { Code } from '@mantine/core';

// function Demo() {
//   return <Code>React.createElement()</Code>;
// }`;

// const AnswerPage = () => {
//   const [visible, { toggle }] = useDisclosure(false);

//   return (
//     <div>
//       <div className={styles.page}>
//         <div className={styles.header}>
//         <Button variant="filled">Home</Button>
//         </div>
//         <Title order={1}>Problem title</Title>
//         <Grid grow>
//           <Grid.Col span={4}>
//             <Title order={2}>Given Function</Title>
//             <CodeHighlight withCopyButton={false} code={demo} language="jsx" />
//           </Grid.Col>
//           <Grid.Col span={4}>
//             <Title order={2}>Test Cases</Title>
//             <TestCases />
//           </Grid.Col>
//           <Grid.Col span={4}>
//             <Title order={2}>Ollama Output</Title>
//             <CodeHighlight withCopyButton={false} code={demo} language="jsx" />
//           </Grid.Col>
//           <Grid.Col span={4}>
//             <Box pos="relative">
//               <LoadingOverlay
//                 visible={visible}
//                 zIndex={1000}
//                 overlayProps={{ radius: 'sm', blur: 2 }}
//                 loaderProps={{ color: 'pink', type: 'bars' }}
//               />
//               {<Textarea
//               label="User Input"
//               description="Description for Given Function"
//               placeholder="Please enter the description for given function."
//               />}
//             </Box>
//             <Space h="md" />
//             <Button fullWidth variant="filled" onClick={toggle}>Submit</Button>
//           </Grid.Col>
//         </Grid>
//       </div>
//     </div>
//   );
// };

// export default AnswerPage;
