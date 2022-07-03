import Head from 'next/head';
import useSWR from 'swr';
import { Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Autocomplete } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

import { fetcher } from '../../../../lib/request';

import styles from './[id].module.css';
import { addCityToDepartment, deleteCityFromDepartment, updateDepartment } from '../../../../api/department';
import { useSnackbar } from '../../../../hooks/useSnackbar';

const TYPE_MAPPER = {
    b2b: 'B2B',
    b2o: 'B2O',
    gus: 'ГУС/ТЦТЭT',
    rrl: 'Группа РРЛ',
    admin: 'Технический отдел (Администрация)',
    net: 'Сетевой отдел',
    man: 'Руководство'
}

const City = ({ name, type, _id, departmentID, update }) => {
    const { openSnackbar } = useSnackbar();

    const onDelete = useCallback(() => {
        deleteCityFromDepartment(departmentID, _id)
            .then(() => {
                update();
                openSnackbar('Город успешно удален из отдела');
            })
            .catch(() => {
                openSnackbar('Что-то пошло не так');
            })
    }, [_id, departmentID]);

    return (
        <ListItem key={_id} disableGutters>
            <ListItemText primary={`${type} ${name}`} />
            <IconButton onClick={onDelete}>
                <DeleteIcon />
            </IconButton>
        </ListItem>
    )
}

const DepartmentContent = ({ department, cities, update }) => {
    const [suggest, setSuggest] = useState('');

    const { openSnackbar } = useSnackbar();

    const isGus = department.type === 'gus';

    const onInputChange = useCallback((e, v) => {
        setSuggest(v);
    }, []);

    const onChange = useCallback((e, v) => {
        if (!v) {
            return;
        }

        addCityToDepartment(department._id, v.id)
            .then(() => {
                setSuggest('');
                update();
                openSnackbar('Город успешно добавлен');
            })
            .catch(() => {
                openSnackbar('Что-то пошло не так');
            });
    }, []);

    const onSubmit = useCallback((e, t) => {
        e.preventDefault();

        const { name, priorityCapacity } = e.target;

        const data = {};

        name && (data.name = name.value);
        priorityCapacity && (data.priorityCapacity = priorityCapacity.value);

        updateDepartment(department._id, data)
            .then(() => {
                update();
                openSnackbar('Информация успешно сохранена')
            })
            .catch(() => {
                openSnackbar('Что-то пошло не так');
            })
    }, [])

    return (
        <>
            <Typography variant="h6">Редактирование отдела <i>{department.name} [{TYPE_MAPPER[department.type]}]</i></Typography>
            <form onSubmit={onSubmit}>
                <TextField name="name" label="Название отдела" className={styles.input} defaultValue={department.name} fullWidth required />
                {isGus && <TextField name="priorityCapacity" label="Макс. кол-во приоритетных заявок" className={styles.input} defaultValue={department.priorityCapacity || 0} fullWidth type="number" required />}
                <Button type="submit" variant="contained">Сохранить</Button>
            </form>
            {isGus && (
                <div className={styles.cities}>
                    <Typography color="primary">Обслуживаемые города</Typography>
                    <Autocomplete
                        onInputChange={onInputChange}
                        onChange={onChange}
                        inputValue={suggest}
                        blurOnSelect
                        clearOnBlur
                        value={suggest}
                        fullWidth
                        className={styles.suggest}
                        options={cities}
                        componentsProps={{ paper: { style: { maxHeight: 250 } } }}
                        renderInput={(params) => <TextField {...params} label="Добавить город" />}
                    />
                    <List className={styles.citiesList}>
                        {department.cities.map((data) => <City {...data} departmentID={department._id} update={update} />)}
                    </List>
                </div>
            )}
        </>
    );
}

const DepartmentPage = ({ departmentID }) => {
    const { data, error, mutate } = useSWR('/api/admin/department/' + departmentID, fetcher);
    const cities = useSWR('/api/admin/unused-cities', fetcher);

    const update = useCallback(() => {
        mutate();
        cities.mutate();
    }, [mutate, cities.mutate]);

    if (error || cities.error) {
        return 'Что-то пошло не так';
    }

    if (!data || !cities.data) {
        return 'Загрузка...';
    }

    return (
        <div className={styles.root}>
            <Head>
                <title>Редактирование отдела</title>
            </Head>
            <DepartmentContent department={data} cities={cities.data} update={update} />
        </div>
    );
}

export default DepartmentPage;

export const getServerSideProps = async ({ res }) => {
    const departmentID = String(res.locals.department._id);

    return {
        props: {
            departmentID,
            fallback: {
                ['/api/admin/department/' + departmentID]: JSON.parse(JSON.stringify(res.locals.department)),
                '/api/admin/unused-cities': JSON.parse(JSON.stringify(res.locals.cities)),
            },
        }
    };
}
