import React from 'react';
import { Button } from '@mantine/core';

const LoginButton = () => {
    return (
        <div>
            <p>You must be logged in before you are able to access the application.</p>
            <Button color="Green"><a href="/api/auth/login">Login</a></Button>
        </div>
    );
  };
  
  export default LoginButton;