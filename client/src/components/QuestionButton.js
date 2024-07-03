import React from 'react';
import Link from 'next/link';
import { Button } from '@mantine/core';

const QuestionButton = ({ disabled, style, children }) => {
  return (
    <Link href="/answer_page">
      <Button
        disabled={disabled}
        style={style}
        className="question-button"
      >
        {children}
      </Button>
    </Link>
  );
};

export default QuestionButton;