'use client'

import { Table, NumberFormatter } from '@mantine/core';

export default function StatsTable({ stats, userData }) {
    const rows = stats.map((question, index) => {
      return (
        <Table.Tr key={question.stage}>
          <Table.Td>{`${question.stage}. ${question.name}`}</Table.Td>
          <Table.Td style={{textAlign: 'right'}}>{userData.questions_solved[index + 1]}</Table.Td>
          <Table.Td style={{textAlign: 'right'}}> <NumberFormatter value={stats[index].average_score} decimalScale={2} /> </Table.Td>
        </Table.Tr>
      );
    });
  
    return (
        <Table highlightOnHover style={{width: '75%'}}>
            <Table.Thead>
            <Table.Tr>
                <Table.Th style={{width: '60%'}}>Stage</Table.Th>
                <Table.Th style={{textAlign: 'right', width: '20%'}}>Your Score</Table.Th>
                <Table.Th style={{textAlign: 'right', width: '20%'}}>Average Score</Table.Th>
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    )
  }