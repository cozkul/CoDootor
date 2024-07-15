'use server'

import React from 'react';
import { Space, Image, Title } from '@mantine/core';
import styles from '../app/page.module.css';
import GetUser from '@/util/GetUser';

export default async function UserBanner({ sessionInfo }) {
  const userData = await GetUser(sessionInfo);

  return (
    <div className={styles.logo}>
      <Image h={79} w="auto" fit="contain" src={sessionInfo.user.picture}></Image>
      <Space w="md"></Space>
      <div>
        <Title order={1}>Welcome, {sessionInfo.user.nickname}!</Title>
        <Title order={2}>Your score is {userData.num_points}</Title>
      </div>
    </div>
  );
};