'use server'

import React from 'react';
import { Space, Image, Title } from '@mantine/core';
import styles from '../app/page.module.css';

const UserBanner = ({ sessionInfo }) => {
  return (
    <div className={styles.logo}>
      <Image h={79} w="auto" fit="contain" src={sessionInfo.user.picture}></Image>
      <Space w="md"></Space>
      <div>
        <Title order={1}>Welcome, {sessionInfo.user.nickname}!</Title>
        <Title order={2}>Your score is 123</Title>
      </div>
    </div>
  );
};

export default UserBanner;