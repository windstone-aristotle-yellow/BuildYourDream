import {
  Box,
  Button,
  Container,
  createStyles,
  Drawer,
  Grid,
  Group,
  MediaQuery,
  Paper,
  Stack,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { NextLink } from '@mantine/next';
import { useRouter } from 'next/router';
import { useToggle } from '@mantine/hooks';
import { useAuth } from '../../../components/Providers/Auth/AuthWrapper';
import { Block, PageHeader } from '../../../components/Layout';
import { useTemplateData } from '../../../components/hooks/templates';
import { useComponentsList } from '../../../components/hooks/components';
import { IComponent } from '../../../types/Template';
import { Filters } from '../../../components/Layout/Filters/Filters';
import { ComponentRow } from '../../../components/Layout/ComponentRow/ComponentRow';

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
export default function Category() {
  const router = useRouter();
  const { classes } = useStyles();
  const [showFilters, toggleFilters] = useToggle();
  const [filters, setFilters] = useState({});

  const { user } = useAuth();

  const { data: templateData } = useTemplateData(router.query.categoryId as string);
  const {
    data: components,
    isFetched: isComponentsFetched,
    refetch,
  } = useComponentsList(router.query.categoryId as string, filters);

  useEffect(() => {
    const { categoryId, ...f } = router.query;
    setFilters(f);
  }, [router.query]);

  useEffect(() => {
    refetch();
  }, [filters]);

  return (
    <Stack>
      <PageHeader
        title={templateData?.name ?? ''}
        rightSection={
          <Group>
            {user && user.role === 'ADMIN' && (
              <Button href={`/templates/edit/${router.query.categoryId}`} component={NextLink}>
                Изменить
              </Button>
            )}
            {user && user.role === 'ADMIN' && (
              <Button
                href={`/components/create?templateId=${router.query.categoryId}`}
                component={NextLink}
              >
                Добавить
              </Button>
            )}
            <Button href="/components" component={NextLink}>
              Назад
            </Button>
          </Group>
        }
      />
      <Box>
        <Container size={1600} p={0}>
          <Grid>
            <Grid.Col lg={3}>
              <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
                <Box>
                  <Filters fields={templateData?.fields} />
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
            <Grid.Col lg={9}>
              <Stack>
                {isComponentsFetched &&
                  components.map((component: IComponent) => (
                    <Block
                      href={`/components/${router.query.categoryId}/${component.id}`}
                      key={component.id}
                      component={NextLink}
                    >
                      <ComponentRow component={component} />
                    </Block>
                  ))}
              </Stack>
            </Grid.Col>
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
        <Filters fields={templateData?.fields} />
      </Drawer>
    </Stack>
  );
}
