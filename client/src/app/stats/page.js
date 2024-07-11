'use client';

import React, { useState, useEffect } from 'react';
import { Button, Title, Textarea, Grid, Space, LoadingOverlay, Box } from '@mantine/core';
import '@mantine/code-highlight/styles.css';
import styles from './page.module.css';
import HomeButton from '@/components/HomeButton';

const AnswerPage = () => {

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

  return (
    <div>
      <div className={styles.page}>
        <div className={styles.header}>
          <HomeButton></HomeButton>
        </div>

      </div>
    </div>
  );
};

export default AnswerPage;