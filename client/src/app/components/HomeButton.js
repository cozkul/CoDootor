import React from 'react';
import Link from 'next/link';

// link to the home page
const HomeButton = () => {
  return (
    <Link href="/"> 
      <button className="home-button">Home</button>
    </Link>
  );
};

export default HomeButton;
