import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { CITY_TYPES } from "src/constants/city";

const schema = yup
  .object({
    name: yup.string().required("Название города обязательно").min(3).max(30).trim(),
    type: yup.string().required().oneOf(CITY_TYPES),
  })
  .required();

export const useAddCityButtton = () => {
  const [dialogOpened, setDilogOpened] = React.useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors, defaultValues },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onSubmit",
    defaultValues: {
      type: "г.",
    },
  });

  const onCloseDialog = React.useCallback(() => {
    setDilogOpened(false);
  }, []);

  const openDialog = React.useCallback(() => {
    setDilogOpened(true);
  }, []);

  const onSubmit = React.useCallback((data) => {
    console.log(data);
  }, []);

  return {
    dialogOpened,
    onCloseDialog,
    openDialog,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    defaultValues,
  };
};
