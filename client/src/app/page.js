'use server'

import styles from "./page.module.css";
import { Title } from '@mantine/core';
import { NavbarSimple } from "@/components/NavbarSimple/NavbarSimple";
import QuestionList from "@/components/QuestionList";
import { getSession } from '@auth0/nextjs-auth0';
import LoginPrompt from "@/components/LoginPrompt";

export default async function Home() {
  const sessionInfo = await getSession();
  const questions = await fetch(`http://host.docker.internal:5001/question_list`)
    .then(res => res.json())
    .then(res => JSON.parse(res))
    .then(res => res.question_list)
    .catch(error => console.error('Error fetching data:', error));
  console.log(sessionInfo);

  return (
    sessionInfo == null ? 
    <div className={styles.loginPromptPage}>
      <LoginPrompt></LoginPrompt>
    </div> :
    <div>
      <div className={styles.page}>
        <div>
          <NavbarSimple />
        </div>
        <div className={styles.centerColumn}>
          <Title order={1}>Welcome, {sessionInfo.user.nickname}!</Title>
          <Title order={2}>Your score is 123</Title>
          <br></br>
          <QuestionList questions={questions} />
        </div>

      </div>
    </div>
  )
}