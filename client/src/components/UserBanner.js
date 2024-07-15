'use server'

import React from 'react';
import { Space, Image, Title } from '@mantine/core';
import styles from '../app/page.module.css';

export default async function UserBanner({ sessionInfo, userData }) {
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