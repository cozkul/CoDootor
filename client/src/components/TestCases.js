'use client'

import { Tabs, rem } from '@mantine/core';
import { IconCircleDotted, IconCheck, IconX } from '@tabler/icons-react';


// Test cases section for UI, this should retrieve prestored testcases for each question
const TestCases = () => {
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Tabs defaultValue="test1">
      <Tabs.List>
        <Tabs.Tab value="test1" leftSection={<IconCircleDotted style={iconStyle} />}>
          Test 1
        </Tabs.Tab>
        <Tabs.Tab value="test2" leftSection={<IconCheck style={iconStyle} />}>
          Test 2
        </Tabs.Tab>
        <Tabs.Tab value="test3" leftSection={<IconX style={iconStyle} />}>
          Test 3
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="test1">
        Test 1 tab content
      </Tabs.Panel>

      <Tabs.Panel value="test2">
        Test 2 tab content
      </Tabs.Panel>

      <Tabs.Panel value="test3">
        Test 3 tab content
      </Tabs.Panel>
  </Tabs>
  );
};

export default TestCases;
