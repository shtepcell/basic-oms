import React, { useCallback, useState } from 'react';
import { Typography,  Grid, Card, CardActions, CardContent, Button, Link, LinearProgress } from '@mui/material';
import moment from 'moment'
const texts = {
    'succes': 'Перевести в стасус "Включен"',
    'shutdown': 'Перевести в стасус "Отключен"',
    'increase-priority': 'Повысить приоритет',
    'decrease-priority': 'Понизить приоритет',
}

import { useRequest } from '../../hooks/useRequest';
import styles from './index.module.css'

export const RequestsList = React.memo(({ requests, refresh, isAdmin }) => {
    const request = useRequest();
    const [loading, setLoading] = useState('');

    const onReject = useCallback((id) => () => {
        setLoading(id)
        request.patch(`/api/mass/${id}`, { status: 'rejected' }).finally(() => {
            refresh();
        });
    }, [request]);

    const onApprove = useCallback((id) => () => {
        setLoading(id)
        request.patch(`/api/mass/${id}`, { status: 'aproved' }).finally(() => {
            refresh();
        });
    }, [request]);

    return (
        <section>
            <Typography variant="h5" sx={{ mb: 2 }}>Список заявок</Typography>
            <Grid container spacing={3}>
                {(requests || []).map((item) => {
                    return (
                        <Grid item key={item._id}>
                            <Card sx={{ maxWidth: 475, maxHeight: 600 }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                                        {item.author.login}
                                    </Typography>
                                    <Typography variant="h6" component="div">
                                        {texts[item.action] || item.action}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, fontSize: 14  }} color="text.secondary">
                                        {moment(item.created).format('DD.MM.YYYY HH:mm')}
                                    </Typography>
                                    <Typography variant="body2" className={styles.card}>
                                        ID заказов (всего {item.orders.length}):
                                        <br />
                                        {item.orders.map(id => <><Link key={id} underline="hover" href={`/order/${id}`} target="_blank">{id}</Link> </>)}
                                    </Typography>
                                </CardContent>
                                {loading === item._id ?
                                    <LinearProgress /> :
                                    <CardActions>
                                        {isAdmin && <Button variant="text" onClick={onApprove(item._id)}>Подтвердить</Button>}
                                        <Button variant="text" color="error" onClick={onReject(item._id)}>Отклонить</Button>
                                    </CardActions>
                                }
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </section>
    )
})
