import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { CITY_TYPES } from "src/constants/city";
import { useSnackbar } from "src/hooks/useSnackbar";
import { createCity } from "src/api/cities";
import { useAuth } from "src/hooks/useAuth";

const schema = yup
  .object({
    name: yup
      .string()
      .required("Название города обязательно")
      .min(3)
      .max(30)
      .trim(),
    type: yup.string().required().oneOf(CITY_TYPES),
    access: yup.array().required().min(1),
  })
  .required();

export const useAddCityButtton = () => {
  const { openSnackbar } = useSnackbar();
  const [dialogOpened, setDilogOpened] = React.useState(false);
  const { user } = useAuth();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, defaultValues },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onSubmit",
    defaultValues: {
      type: "г.",
      access: user.access,
    },
  });

  const onCloseDialog = React.useCallback(() => {
    setDilogOpened(false);
  }, []);

  const openDialog = React.useCallback(() => {
    setDilogOpened(true);
  }, []);

  const onSubmit = React.useCallback(
    (data) => {
      createCity(data)
        .then(() => {
          onCloseDialog();
          reset();
          openSnackbar("Успешно сохранено!");
        })
        .catch(() => {
          openSnackbar(
            "Ошибка сохранения! Возможно такой город уже есть в системе.",
            "error"
          );
        });
    },
    [onCloseDialog, reset, openSnackbar]
  );

  return {
    dialogOpened,
    onCloseDialog,
    openDialog,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    defaultValues,
    isAccessEditAllowed: user.access.length > 1,
  };
};
