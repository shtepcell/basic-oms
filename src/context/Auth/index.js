import React from "react";

export const AuthContext = React.createContext({ access: [] });

export const AuthProvider = AuthContext.Provider;
