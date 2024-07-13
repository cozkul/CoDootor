'use server'

import styles from "./page.module.css";
import { Space, Image, Title } from '@mantine/core';
import { NavbarSimple } from "@/components/NavbarSimple/NavbarSimple";
import QuestionList from "@/components/QuestionList";
import { getSession } from '@auth0/nextjs-auth0';
import LoginPrompt from "@/components/LoginPrompt";
import UserBanner from "@/components/UserBanner";

export default async function Home() {
  const sessionInfo = await getSession();
  const questions = await fetch(`http://host.docker.internal:5001/question_list`)
    .then(res => res.json())
    .then(res => JSON.parse(res))
    .then(res => res.question_list)
    .catch(error => console.error('Error fetching data:', error));

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
          <UserBanner sessionInfo={sessionInfo}/>
          <br></br>
          <QuestionList questions={questions} />
        </div>
        

      </div>
    </div>
  )
}