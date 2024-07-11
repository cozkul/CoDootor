import React from 'react';
import Link from 'next/link';
import { Button } from '@mantine/core'

// link to the home page
const HomeButton = () => {
  return (
    <Link href="/">
      <Button variant="filled">Home</Button>
    </Link>
  );
};

export default HomeButton;
