'use server';

// import React, { useState, useEffect } from 'react';
import styles from "./page.module.css";
import { Space, Image, Title } from '@mantine/core';
import { NavbarSimple } from "@/components/NavbarSimple/NavbarSimple";
import LeaderboardTable from "@/components/LeaderboardTable";
import { getSession } from '@auth0/nextjs-auth0';
import LoginPrompt from "@/components/LoginPrompt";

export default async function LeaderboardPage() {

//   useEffect(() => {
//     fetch(`http://localhost:5001/question/${questionId}`)
//     .then(resp => {
//       if (resp.ok) return resp;
//       else throw new Error("Invalid question ID.");
//     })
//     .then(resp => resp.json())
//     .then(data => {
//       setGivenFunction(data);
//       setProblemTitle(`Problem ${questionId}`);
//       setValidQuestion(true);
//     })
//     .catch(err => {
//       setValidQuestion(false);
//     })
//   }, [])
// };
  const sessionInfo = await getSession();
  const users = [];
  const cur_user_id = sessionInfo.user.email;

  return (
    <div>
      <div className={styles.page}>
        <div>
          <NavbarSimple />
        </div>
        <div className={styles.centerColumn}>
          <div className={styles.logo}>
            <Image h={79} w="auto" fit="contain" src={sessionInfo.user.picture}></Image>
            <Space w="md"></Space>
            <div>
              <Title order={1}>Welcome, {sessionInfo.user.nickname}!</Title>
              <Title order={2}>Your score is 123</Title>
            </div>
          </div>
          <br></br>
          <LeaderboardTable users={users} cur_user_id={cur_user_id}/>
        </div>
      </div>
    </div>
  );
};