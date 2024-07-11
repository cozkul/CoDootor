'use client'

/*
Adapted from NavbarSimple template from mantine
*/
import { useState } from 'react';
import { Image, Group, Code, Text } from '@mantine/core';
import {
  IconHomeFilled,
  IconTrophyFilled,
  IconChartBar,
  IconSwitchHorizontal,
  IconLogout
} from '@tabler/icons-react';
import classes from './NavbarSimple.module.css';

const data = [
  { link: 'https://localhost:5173', label: 'Home', icon: IconHomeFilled },
  { link: '', label: 'Leaderboards', icon: IconTrophyFilled },
  { link: 'https://localhost:5173/stats', label: 'Stats', icon: IconChartBar },
];

export function NavbarSimple() {
  const [active, setActive] = useState('Home');

  const links = data.map((item) => (
    <a  
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Image src={"./logo.png"}></Image>
          <Code fw={700}>v1.0</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a href="/api/auth/logout" className={classes.link}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}