'use server';

// import React, { useState, useEffect } from 'react';
import styles from "./page.module.css";
import { Space, Image, Title } from '@mantine/core';
import { NavbarSimple } from "@/components/NavbarSimple/NavbarSimple";
import LeaderboardTable from "@/components/LeaderboardTable";
import { getSession } from '@auth0/nextjs-auth0';
import LoginPrompt from "@/components/LoginPrompt";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import UserBanner from "@/components/UserBanner";

export default withPageAuthRequired(async function StatsPage() {

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
          <UserBanner sessionInfo={sessionInfo}/>
          <br></br>
          <LeaderboardTable users={users} cur_user_id={cur_user_id}/>
        </div>
      </div>
    </div>
  );
}, { 'returnTo': '/stats' });