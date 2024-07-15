'use client'

import { Table, Rating } from '@mantine/core';
import {
  IconLockFilled,
  IconLockOpen2,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';
import QuestionButton from "@/components/QuestionButton";

export default function LeaderboardTable({ users, cur_user_id }) {
    const ranks = users.map((user, index) => ({
        id: user.user_id,
        rank: index + 1,
        nick: user.nickname,
        points: user.num_points
    }));

    const rows = ranks.map((user) => {
  
      return (
        <Table.Tr key={user.rank} bg={(cur_user_id == user.id) ? 'var(--mantine-color-blue-light)' : undefined}>
          <Table.Td>{user.rank}</Table.Td>
          <Table.Td>{user.nick}</Table.Td>
          <Table.Td>{user.points}</Table.Td>
        </Table.Tr>
      );
    });
  
    return (
        <Table striped highlightOnHover style={{width: '75%'}}>
            <Table.Thead>
            <Table.Tr>
                <Table.Th style={{width: '5%'}}>Rank</Table.Th>
                <Table.Th style={{width: '10%'}}>User</Table.Th>
                <Table.Th style={{width: '40%', textAlign: 'right'}}>Score</Table.Th>
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    )
  }