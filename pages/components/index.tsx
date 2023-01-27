import { Box, Button, createStyles, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { NextLink } from '@mantine/next';
import axios from 'axios';
import { useAuth } from '../../components/Providers/Auth/AuthWrapper';
import { PageHeader } from '../../components/Layout';
import { ITemplate } from '../../types/Template';

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

//TODO: Make separate component
const Category = React.memo(({ data }: { data: any }) => {
  const { classes } = useStyles();
  return (
    <Paper className={classes.box} shadow="xl" component={NextLink} href={`/parts/${data.id}`}>
      <Box className={classes.boxContent}>
        <Text weight={700} size={24}>
          {data.name}
        </Text>
      </Box>
    </Paper>
  );
});

export default function Parts() {
  const { user } = useAuth();

  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    axios.get('/api/templates').then((res) => setTemplates(res.data));
  }, []);

  return (
    <Stack>
      <PageHeader
        title="Комплектующие"
        rightSection={
          <Group>
            {user && user.role === 'ADMIN' && (
              <Button component={NextLink} href="/components/create">
                Добавить деталь
              </Button>
            )}
            {user && user.role === 'ADMIN' && (
              <Button component={NextLink} href="/templates/create">
                Добавить группу/форму
              </Button>
            )}
          </Group>
        }
      />
      <SimpleGrid cols={2} breakpoints={[{ minWidth: 'md', cols: 6 }]}>
        {templates.map((template: ITemplate & { id: string }) => (
          <Category key={template.id} data={template} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}