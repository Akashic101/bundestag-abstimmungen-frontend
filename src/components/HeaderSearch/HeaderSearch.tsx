import { Autocomplete, Group, Burger, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import classes from './HeaderSearch.module.css';
import React, { useEffect, useState } from 'react';
import Logo from '../Logo/Logo.tsx'

const links = [
  { link: '/parteien', label: 'Parteien' },
  { link: '/abgeordnete', label: 'Abgeordnete' },
  { link: '/about', label: 'About' },
];

export default function HeaderSearch() {
  const [opened, { toggle }] = useDisclosure(false);
  const [abgeordneter, setAbgeordneter] = useState('');
  const [abgeordnete, setAbgeordnete] = useState([]);

  useEffect(() => {
      fetch(
        `http://localhost:3000/mitglieder/search`,
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setAbgeordnete(data)
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }, []);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <Logo />
        </Group>

        <Group>
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
          <Autocomplete
            className={classes.search}
            placeholder="Suche nach Abgeordnetem"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            data={abgeordnete}
            value={abgeordneter} onChange={setAbgeordneter}
            limit={10}
          />
        </Group>
      </div>
    </header>
  );
}