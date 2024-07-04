'use client';

import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button, Title, Textarea, Grid, Space, LoadingOverlay, Box } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import TestCases from '../../components/TestCases';
import '@mantine/code-highlight/styles.css';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';

const AnswerPage = () => {
  const [visible, { toggle }] = useDisclosure(false);
  const [problemTitle, setProblemTitle] = useState('');
  const [givenFunction, setGivenFunction] = useState('');
  const [userInput, setUserInput] = useState('');
  const [ollamaOutput, setOllamaOutput] = useState('');
  const [testResults, setTestResults] = useState('');
  const searchParams = useSearchParams();
  // const questionId = searchParams.get('questionId');
  const questionId = 1;

  useEffect(() => {
    fetch(`http://localhost:5001/question/${questionId}`)
    .then(resp => resp.json())
    .then(data => {
      setGivenFunction(data);
      setProblemTitle(`Problem ${questionId}`);
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
    toggle();
    try {
      const response = await fetch('http://localhost:5001/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ desc: userInput }),
      });
      const data = await response.json();
      setOllamaOutput(data.llm_code);

      const testResponse = await fetch('http://localhost:5001/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: questionId, llm_code: data.llm_code }),
      });
      const testData = await testResponse.json();
      setTestResults(testData);
    } catch (error) {
      console.error(error);
    } finally {
      toggle();
    }
  };

  return (
    <div>
      <div className={styles.page}>
        <div className={styles.header}>
          <Button variant="filled" onClick={() => window.history.back()}>Home</Button>
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
