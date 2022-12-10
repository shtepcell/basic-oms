import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { useAddCityButtton } from "./hooks/useAddCItyButton";

import styles from "./index.module.css";
import { CITY_TYPES } from "src/constants/city";

export const AddCityButton = () => {
  const {
    openDialog,
    onCloseDialog,
    dialogOpened,
    register,
    handleSubmit,
    errors,
    defaultValues,
    isAccessEditAllowed,
  } = useAddCityButtton();

  return (
    <>
      <Button
        sx={{ width: 200 }}
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={openDialog}
      >
        Добавить город
      </Button>
      <Dialog open={dialogOpened} onClose={onCloseDialog}>
        <DialogTitle>Добавление города</DialogTitle>
        <DialogContent sx={{ width: 600 }}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Stack direction="row" spacing={1}>
              <FormControl sx={{ width: 120 }}>
                <InputLabel id="city_type">Тип</InputLabel>
                <Select
                  labelId="city_type"
                  {...register("type")}
                  defaultValue={defaultValues.type}
                  label="Тип"
                >
                  {CITY_TYPES.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                {...register("name")}
                fullWidth
                label="Название города"
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
              {isAccessEditAllowed && (
                <FormControl sx={{ width: 280 }}>
                  <InputLabel id="city_access" error={Boolean(errors.access)}>
                    Доступ
                  </InputLabel>
                  <Select
                    labelId="city_access"
                    multiple
                    {...register("access")}
                    defaultValue={defaultValues.access}
                    label="Доступ"
                    error={Boolean(errors.access)}
                  >
                    {["miranda", "mirtelekom"].map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog}>Отмена</Button>
          <Button color="primary" onClick={handleSubmit}>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
