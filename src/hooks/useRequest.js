import React from "react"
import { request } from '../lib/request';

export const useRequest = () => {
    return React.useMemo(() => request, []);
}