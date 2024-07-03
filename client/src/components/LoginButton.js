import React from 'react';
import { Button } from '@mantine/core';

const LoginButton = () => {
    return (
        <Button color="Green"><a href="/api/auth/login">Login</a></Button>
    );
  };
  
  export default LoginButton;