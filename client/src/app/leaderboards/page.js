'use server'

// import React, { useState, useEffect } from 'react';
import styles from "./page.module.css";
import { Space, Image, Title } from '@mantine/core';
import { NavbarSimple } from "@/components/NavbarSimple/NavbarSimple";
import LeaderboardTable from "@/components/LeaderboardTable";
import { getSession } from '@auth0/nextjs-auth0';
import LoginPrompt from "@/components/LoginPrompt";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import UserBanner from "@/components/UserBanner";
import GetUser from "@/util/GetUser";

export default withPageAuthRequired(async function LeaderboardPage() {

  const sessionInfo = await getSession();
  const selfUser = await GetUser({sessionInfo})
  const users = await fetch("http://host.docker.internal:5001/leaderboard")
  .then(resp => resp.json())
  .catch(err => console.log(err));
  
  users.sort((a, b) => b.num_points - a.num_points);

  return (
    <div>
      <div className={styles.page}>
        <div>
          <NavbarSimple />
        </div>
        <div className={styles.centerColumn}>
          <UserBanner sessionInfo={sessionInfo}/>
          <br></br>
          <LeaderboardTable users={users} cur_user_id={selfUser.user_id}/>
        </div>
      </div>
    </div>
  );
}, { 'returnTo': '/leaderboards' });