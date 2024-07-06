'use client'

import styles from "./page.module.css";
import { Title, Table, Rating } from '@mantine/core';
import { NavbarSimple } from "./NavbarSimple/NavbarSimple";
import {
  IconLockFilled,
  IconLockOpen2,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';
import { NavLink } from "@mantine/core";
import QuestionButton from "@/components/QuestionButton";
import { useState, useEffect } from "react";

export default function Home() {

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const resp = await fetch(`http://localhost:5001/question_list`);
        if (!resp.ok) throw new Error("Couldn't fetch questions.");
        var data = await resp.json();
        data = JSON.parse(data)
        setQuestions(data.question_list);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, []);

  const stages = questions.map((question, index) => ({
    id: question.stage,
    status: 'unlocked',
    stage: question.stage,
    name: question.name,
    score: 1 / question.num_tests
  }));


  const rows = stages.map((question) => {
    const filledStars = Math.floor(question.score / 0.33);

    return (
      <Table.Tr key={question.stage}>
        <Table.Td>{question.status === 'unlocked' ? <IconLockOpen2 /> : <IconLockFilled />}</Table.Td>
        <Table.Td>{`${question.stage}. ${question.name}`}</Table.Td>
        <Table.Td style={{ textAlign: 'right'}}>{`${Math.round(question.score * 100)}%`}</Table.Td>
        <Table.Td> <Rating emptySymbol={<IconStar/>} fullSymbol={<IconStarFilled/>} count={3} defaultValue={filledStars} readOnly/> </Table.Td>
        <Table.Td>
          <QuestionButton
            url={'/question/' + question.id}
            disabled={question.status === 'locked'} 
            style={question.status === 'locked' ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {}}
          >
            Proceed
          </QuestionButton>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div>
      <div className={styles.page}>

        <div>
          <NavbarSimple />
        </div>

        <div className={styles.centerColumn}>
          <Title order={1}>Welcome XYZ!</Title>
          <Title order={2}>Your score is 123</Title>
          <br></br>

          <Table striped highlightOnHover withT>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{width: '5%'}}>Status</Table.Th>
                <Table.Th style={{width: '75%'}}>Stage</Table.Th>
                <Table.Th style={{width: '20%', textAlign: 'right'}}>Score</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>

        </div>

      </div>
    </div>
  )
}