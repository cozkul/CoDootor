'use server'

import React from 'react';
import { Space, Image, Title } from '@mantine/core';
import styles from '../app/page.module.css';

export default async function UserBanner({ sessionInfo }) {
  const user_id = sessionInfo.user.sub.split("|")[1];

  // Get the user data for the user id of the current logged-in user
  let userData = await fetch(`http://host.docker.internal:5001/user/${user_id}`)
  .then(res => {
    if (res.ok) return res.json();
    else return null;
  })

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
    }).then(resp => {
      if (resp.ok) return resp.json();
      else return null;
    });
  }

  return (
    <div className={styles.logo}>
      <Image h={79} w="auto" fit="contain" src={sessionInfo.user.picture}></Image>
      <Space w="md"></Space>
      <div>
        <Title order={1}>Welcome, {sessionInfo.user.nickname}!</Title>
        <Title order={2}>Your score is {userData? userData.num_points : "ERROR"}</Title>
      </div>
    </div>
  );
};