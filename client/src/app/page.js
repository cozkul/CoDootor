'use server'

import styles from "./page.module.css";
import { Title } from '@mantine/core';
import { NavbarSimple } from "./NavbarSimple/NavbarSimple";
import QuestionList from "@/components/QuestionList";

export default async function Home() {
  const questions = await fetch(`http://host.docker.internal:5001/question_list`)
    .then(res => res.json())
    .then(res => JSON.parse(res))
    .then(res => res.question_list)
    .catch(error => console.error('Error fetching data:', error));

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
          <QuestionList questions={questions} />
        </div>

      </div>
    </div>
  )
}