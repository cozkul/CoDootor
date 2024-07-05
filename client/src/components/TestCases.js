import { Center, Paper, Rating, Text, Stack, Tabs, rem, Grid } from '@mantine/core';
import { IconCircleDotted, IconCheck, IconX, IconStarFilled } from '@tabler/icons-react';

// Test cases section for UI, this should retrieve prestored testcases for each question
const TestCases = ({ results }) => {
  const iconStyle = { width: rem(12), height: rem(12) };

  const totalTests = results.length;
  const passedTests = results.filter(test => test.score > 0).length;

  return (
    <Stack
      h={300}
      bg="var(--mantine-color-body)"
      align="stretch"
      justify="top"
      gap="md"
    >
      <Tabs defaultValue={results[0] ? results[0].desc : 'test1'}>
        <Tabs.List>
          {results.map((result, index) => (
            <Tabs.Tab 
              key={index}
              value={result.desc}
              leftSection={result.score > 0 ? <IconCheck style={iconStyle} /> : <IconX style={iconStyle} />}
            >
              Test {index + 1}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {results.map((result, index) => (
          <Tabs.Panel key={index} value={result.desc || `test${index + 1}`}>
            <Text>{result.err ? `Error: ${result.err_reason}` : result.desc}</Text>
          </Tabs.Panel>
        ))}

        {/* Above code is for error message handling but no error returns from Ollama... 
        
          {results.map((result, index) => (
          <Tabs.Panel key={index} value={result.desc}>
            <Text>{result.desc}</Text>
          </Tabs.Panel>
        ))} */}

      </Tabs>
      <Paper shadow="xs" withBorder p="xl">
        <Stack
          bg="var(--mantine-color-body)"
          align="stretch"
          justify="center"
          gap="md"
        >
          <Center><Text>{`${passedTests}/${totalTests} tests passed`}</Text></Center>
          <Center>
            <Grid>
              {results.map((result, index) => (
                <Grid.Col key={index} span={1}>
                  {result.score > 0 ? <IconStarFilled color="gray" /> : null}
                </Grid.Col>
              ))}
            </Grid>
          </Center>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default TestCases;
