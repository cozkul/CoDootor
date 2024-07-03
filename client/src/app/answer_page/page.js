'use client'

import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button, Title, Textarea, Grid, Space, LoadingOverlay, Box } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import TestCases from '../../components/TestCases';

import '@mantine/code-highlight/styles.css';
import styles from './page.module.css';

const demo = `
import { Code } from '@mantine/core';

function Demo() {
  return <Code>React.createElement()</Code>;
}`;

const AnswerPage = () => {
  const [visible, { toggle }] = useDisclosure(false);

  return (
    <div>
      <div className={styles.page}>
        <div className={styles.header}>
        <Button variant="filled">Home</Button>
        </div>
        <Title order={1}>Problem title</Title>
        <Grid grow>
          <Grid.Col span={4}>
            <Title order={2}>Given Function</Title>
            <CodeHighlight withCopyButton={false} code={demo} language="jsx" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={2}>Test Cases</Title>
            <TestCases />
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={2}>Ollama Output</Title>
            <CodeHighlight withCopyButton={false} code={demo} language="jsx" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Box pos="relative">
              <LoadingOverlay
                visible={visible}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'pink', type: 'bars' }}
              />
              {<Textarea
              label="User Input"
              description="Description for Given Function"
              placeholder="Please enter the description for given function."
              />}
            </Box>
            <Space h="md" />
            <Button fullWidth variant="filled" onClick={toggle}>Submit</Button>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
};

export default AnswerPage;
