import { useContext } from "react";
import { SnackbarContext } from "../context/Snackbar";

export const useSnackbar = () => useContext(SnackbarContext);
