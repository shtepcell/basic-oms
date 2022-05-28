import Head from 'next/head';
import useSWR from 'swr';
import { Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Autocomplete } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

import { fetcher } from '../../../../lib/request';

import styles from './[id].module.css';
import { updateDepartment } from '../../../../api/department';

const TYPE_MAPPER = {
    b2b: 'B2B',
    b2o: 'B2O',
    gus: 'ГУС/ТЦТЭT',
    rrl: 'Группа РРЛ',
    admin: 'Технический отдел (Администрация)',
    net: 'Сетевой отдел',
    man: 'Руководство'
}

const City = ({ name, type, _id }) => {
    return (
        <ListItem key={_id} disableGutters>
            <ListItemText primary={`${type} ${name}`} />
            <IconButton>
                <DeleteIcon />
            </IconButton>
        </ListItem>
    )
}

const DepartmentContent = ({ department, cities, update }) => {
    const [suggest, setSuggest] = useState('');
    const [addedCities, setAddedCity] = useState([]);

    const isGus = department.type === 'gus';

    const filteredCities = useMemo(() => {
        return cities.filter(({ id }) => !addedCities.includes(id));
    }, [addedCities, cities]);

    const onInputChange = useCallback((e, v) => {
        setSuggest(v);
    }, []);

    const onChange = useCallback((e, v) => {
        if (!v) {
            return;
        }

        setAddedCity([...addedCities, v.id]);

        setSuggest('');
    }, [addedCities]);

    const onSubmit = useCallback((e, t) => {
        e.preventDefault();

        const { name, priorityCapacity } = e.target;

        const data = {};

        name && (data.name = name.value);
        priorityCapacity && (data.priorityCapacity = priorityCapacity.value);

        updateDepartment(department._id, data).then(() => update());
    }, [])

    return (
        <>
            <Typography variant="h6">Редактирование отдела <i>{department.name} [{TYPE_MAPPER[department.type]}]</i></Typography>
            <form onSubmit={onSubmit}>
                <TextField name="name" label="Название отдела" className={styles.input} defaultValue={department.name} fullWidth required />
                {isGus && <TextField name="priorityCapacity" label="Макс. кол-во приоритетных заявок" className={styles.input} defaultValue={department.priorityCapacity || 0} fullWidth type="number" required />}
                <Button type="submit" variant="contained">Сохранить</Button>
                <Button className={styles.delete} variant="text" color="error">Удалить отдел</Button>
            </form>
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
                    options={filteredCities}
                    componentsProps={{ paper: { style: { maxHeight: 250 } } }}
                    renderInput={(params) => <TextField {...params} label="Добавить город" />}
                />
                <List className={styles.citiesList}>
                    {department.cities.map(City)}
                </List>
            </div>
        </>
    );
}

const DepartmentPage = ({ departmentID, cities }) => {
    const { data, error, mutate } = useSWR('/api/admin/department/' + departmentID, fetcher);

    if (error || !cities) {
        return 'Error';
    }

    if (!data) {
        return 'Loading...';
    }

    return (
        <div className={styles.root}>
            <Head>
                <title>Редактирование отдела</title>
            </Head>
            <DepartmentContent department={data} cities={cities} update={mutate} />
        </div>
    );
}

export default DepartmentPage;

export const getServerSideProps = async ({ res }) => {
    const departmentID = String(res.locals.department._id);

    console.log(departmentID)
    return {
        props: {
            departmentID,
            cities: JSON.parse(JSON.stringify(res.locals.cities)),
            fallback: {
                ['/api/admin/department/' + departmentID]: JSON.parse(JSON.stringify(res.locals.department)),
            },
        }
    };
}
