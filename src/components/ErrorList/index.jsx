import styles from './index.module.css';

const Row = ({ id, errors }) => {
    return (
        <div className={styles.row}>
            <p>На {id} строчке:</p>
            <ul>
                {errors.map((item) => <li>{item}</li>)}
            </ul>
        </div>
    );
}

export const ErrorList = ({ data }) => {
    return (
        <div className={styles.container}>
            {data.map(({ id, errors }) => <Row id={id} errors={errors} />)}
        </div>
    )
}