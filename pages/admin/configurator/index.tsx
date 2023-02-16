import { Button, Group, Stack, Switch, Text } from '@mantine/core';
import React, { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { storage } from '../../../lib/utils';
import { useTemplatesList } from '../../../components/hooks/templates';
import { PageHeader } from '../../../components/Layout';
import { queryClient } from '../../../components/Providers/QueryProvider/QueryProvider';
import { SortableList } from '../../../components/SortableList/SortableList';

export default function AdminConfigurator() {
  const { data: templates, isFetched } = useTemplatesList();

  const form = useForm<{
    templates: {
      required: boolean;
      id: string;
      name: string;
      position: number;
      showInConfigurator: boolean;
    }[];
  }>({
    initialValues: {
      templates: [],
    },
  });

  useEffect(() => {
    isFetched && form.setFieldValue('templates', templates);
  }, [isFetched]);

  const templatesUpdate = useMutation(
    (templatesData: any) =>
      axios.patch('/api/templates', templatesData, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: (data) => {
        showNotification({
          title: 'Успех',
          message: 'Конфигуратор успешно обновлен',
          color: 'green',
        });
        queryClient.invalidateQueries(['templates', 'list']);
      },
      onError: () => {
        showNotification({
          title: 'Ошибка',
          message: 'Во время сохранения произошла ошибка',
          color: 'red',
        });
      },
    }
  );
  const handleSubmit = (values: typeof form.values) => {
    const toSend = values.templates
      .map((v, index) => {
        const original = templates.find((template) => template.id === v.id);
        const isPositionChanged = original.position !== index + 1;
        return {
          id: v.id,
          position: isPositionChanged ? index + 1 : v.position,
          showInConfigurator: v.showInConfigurator,
          required: v.required,
        };
      })
      .filter((v, index) => {
        const original = templates.find((template) => template.id === v.id);
        if (
          original.position !== v.position ||
          v.showInConfigurator !== original.showInConfigurator ||
          v.required !== original.required
        ) {
          return true;
        }
        return false;
      });

    templatesUpdate.mutate(toSend);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <PageHeader
          title="Настройка конфигуратора"
          rightSection={<Button type="submit">Сохранить</Button>}
        />
        <SortableList
          items={form.values.templates}
          onChange={(values) => form.setFieldValue('templates', values)}
          renderItem={(item, index) => (
            <SortableList.Item id={item.id} key={item.id}>
              <Group position="apart">
                <Stack>
                  <Text>{item.name}</Text>
                  <Group>
                    <Switch
                      label="Показывать в конфигураторе"
                      {...form.getInputProps(`templates.${index}.showInConfigurator`, {
                        type: 'checkbox',
                      })}
                    />
                    <Switch
                      label="Обязательный компонент"
                      {...form.getInputProps(`templates.${index}.required`, {
                        type: 'checkbox',
                      })}
                    />
                  </Group>
                </Stack>
                <SortableList.DragHandle />
              </Group>
            </SortableList.Item>
          )}
        />
      </Stack>
    </form>
  );
}