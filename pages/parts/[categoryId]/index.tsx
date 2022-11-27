import {
  Accordion,
  Box,
  Checkbox,
  Container,
  createStyles,
  Drawer,
  Grid,
  Group,
  MediaQuery,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
  Button
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../components/Auth/AuthProvider';
import { NextLink } from '@mantine/next';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useToggle } from '@mantine/hooks';

const types = [
  { label: 'Видеокарты', value: 'gpus' },
  { label: 'Материнские платы', value: 'motherboards' },
  { label: 'Процессоры', value: 'cpus' },
  { label: 'Оперативная память', value: 'ram' },
  { label: 'Блоки питания', value: 'psu' },
  { label: 'Корпуса', value: 'cases' },
  { label: 'Охлаждение', value: 'coolers' },
  { label: 'Накопители', value: 'drives' },
];

const useStyles = createStyles((theme) => ({
  container: {
    padding: theme.spacing.sm,
  },
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
  },
  drawerButton: {
    width: '100%',
  },
}));

const boolValues = [
  { value: 'all', label: 'Все' },
  { value: 'true', label: 'Да' },
  { value: 'false', label: 'Нет' },
];

const Filters = ({ fields }: any) => {
  const { classes } = useStyles();
  return (
    <Stack>
      <Paper className={classes.container} shadow="xl">
        <TextInput />
      </Paper>
      <Paper className={classes.container} shadow="xl">
        <Accordion variant="filled">
          {fields &&
            fields
              .filter((field: any) => !['TEXT', 'LARGE_TEXT'].includes(field.type))
              .map((field: any) => (
                <Accordion.Item value={field.name}>
                  <Accordion.Control>{field.name}</Accordion.Control>
                  <Accordion.Panel>
                    {field.type === 'SELECT' && (
                      <Checkbox.Group orientation="vertical">
                        {field.options.map((option: string) => (
                          <Checkbox label={option} />
                        ))}
                      </Checkbox.Group>
                    )}
                    {field.type === 'RANGE' && (
                      <Group>
                        <Group grow>
                          <NumberInput placeholder="От" />
                          <NumberInput placeholder="До" />
                        </Group>
                      </Group>
                    )}
                    {field.type === 'NUMBER' && <NumberInput placeholder="228" />}
                    {field.type === 'BOOL' && <Select data={boolValues} defaultValue="all"/>}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
        </Accordion>
      </Paper>
    </Stack>
  );
};

interface IForm {
  name: string;
  id: string;
  fields: any[];
}

export default function Category() {
  const router = useRouter();
  const { classes } = useStyles();
  const [showFilters, toggleFilters] = useToggle();

  const [formData, setFormData] = useState<IForm>();
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`/api/forms/${router.query.categoryId}`).then((res) => setFormData(res.data));
  }, []);

  return (
    <Stack>
      <Paper className={classes.container} shadow="xl">
        <Group position="apart">
          <Title order={3}>{formData && formData.name}</Title>
          <Group>
            {user && user.role === 'ADMIN' && (
              <Button href={`/forms/edit/${router.query.categoryId}`} component={NextLink}>
                Изменить
              </Button>
            )}
            <Button href="/parts" component={NextLink}>
              Назад
            </Button>
          </Group>
        </Group>
      </Paper>
      <Box>
        <Container size={1600} p={0}>
          <Grid>
            <Grid.Col lg={3}>
              <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
                <Box>
                  <Filters fields={formData?.fields} />
                </Box>
              </MediaQuery>
              <MediaQuery largerThan="lg" styles={{ display: 'none' }}>
                <Paper className={classes.container} shadow="xl">
                  <Button onClick={() => toggleFilters()} className={classes.drawerButton}>
                    Показать фильтры
                  </Button>
                </Paper>
              </MediaQuery>
            </Grid.Col>
            <Grid.Col lg={9}></Grid.Col>
          </Grid>
        </Container>
      </Box>
      <Drawer
        opened={showFilters}
        onClose={() => toggleFilters()}
        title="Фильтры и поиск"
        padding="xl"
        size="xl"
      >
        <Filters fields={formData?.fields} />
      </Drawer>
    </Stack>
  );
}