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

  if (!sessionInfo) return (
  <div className={styles.loginPromptPage}>
    <LoginPrompt></LoginPrompt>
  </div>
  )

  const user_id = sessionInfo.user.sub.split("|")[1];

  // Get the user data for the user id of the current logged-in user
  let userData = await fetch(`http://host.docker.internal:5001/user/${user_id}`)
  .then(res => {
    if (res.ok) return res.json();
    else return null;
  });

  // If user doesn't already exist, then we use the POST endpoint to create a new one
  if (!userData) {
    const data = {
      "user_id": user_id,
      "nickname": sessionInfo.user.nickname
    }

    userData = await fetch(`http://host.docker.internal:5001/user/`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": 'application/json'
      }
    }).then(resp => resp.json());
  }

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
          <UserBanner sessionInfo={sessionInfo}/>
          <br></br>
          <QuestionList questions={questions} userData={userData} />
        </div>
        

      </div>
    </div>
  )
}