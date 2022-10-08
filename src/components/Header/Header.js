import { AppBar, Button, Stack, Toolbar } from "@mui/material";
import React from "react";

const NAVIGATION_LINKS = [
  { name: "Главная", href: "/" },
  { name: "Поиск заказов", href: "/search" },
];

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Stack spacing={1} direction="row">
          {NAVIGATION_LINKS.map(({ href, name }) => (
            <Button key={name} sx={{ color: "#fff" }} href={href}>
              {name}
            </Button>
          ))}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
