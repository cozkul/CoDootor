import React from 'react';
import { Button } from '@mantine/core';

const LogoutButton = () => {
    return (
        <Button color="Red"><a href="/api/auth/logout">Logout</a></Button>
    );
  };
  
  export default LogoutButton;