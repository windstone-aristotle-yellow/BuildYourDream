import {
  Box,
  Button,
  createStyles,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { NextLink } from '@mantine/next';
import axios from 'axios';
import { useAuth } from '../../components/Auth/AuthProvider';
import { Block } from '../../components/Block/Block';

const useStyles = createStyles((theme) => ({
  box: {
    position: 'relative',
    width: '100%',
    borderRadius: theme.radius.md,
    '&:before': {
      content: "''",
      display: 'block',
      paddingTop: '100%',
    },
  },
  boxContent: {
    position: 'absolute',
    padding: theme.spacing.sm,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    textAlign: 'center',
    justifyContent: 'center',
  },
}));

const Category = React.memo(({ data }: { data: any }) => {
  const { classes } = useStyles();
  return (
    <Paper className={classes.box} shadow="xl" component={NextLink} href={`/parts/${data.id}`}>
      <Box className={classes.boxContent}>
        <Text weight={700} size={24}>{data.name}</Text>
      </Box>
    </Paper>
  );
});

export default function Parts() {
  const { user } = useAuth();

  const [forms, setForms] = useState([]);

  useEffect(() => {
    axios.get('/api/forms').then((res) => setForms(res.data));
  }, []);

  return (
    <Stack>
      <Block>
        <Group position="apart">
          <Title order={3}>Комплектующие</Title>
          <Group>
            {user && user.role === 'ADMIN' && (
              <Button component={NextLink} href="/parts/create">
                Добавить деталь
              </Button>
            )}
            {user && user.role === 'ADMIN' && (
              <Button component={NextLink} href="/forms/create">
                Добавить группу/форму
              </Button>
            )}
          </Group>
        </Group>
      </Block>
      <SimpleGrid cols={2} breakpoints={[{ minWidth: 'md', cols: 6 }]}>
        {forms.map((form: any) => (
          <Category key={form.id} data={form} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
