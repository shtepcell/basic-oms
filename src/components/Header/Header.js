import { AppBar, Button, Menu, MenuItem, Stack, Toolbar } from "@mui/material";
import React from "react";

const ADMIN_LINKS = [
  { name: "Пользователи", href: "/v2/admin/users" },
  { name: "Отделы", href: "/admin/departments" },
  { name: "Города", href: "/v2/cities" },
  { name: "Улицы", href: "/admin/street" },
  { name: "Клиенты", href: "/admin/clients" },
  { name: "Типы клиентов", href: "/admin/client-types" },
  { name: "Провайдеры", href: "/admin/providers" },
  { name: "Настройки", href: "/admin/configuration" },
];

export const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navLinks = React.useMemo(
    () => [
      { name: "Главная", href: "/" },
      { name: "Поиск заказов", href: "/search" },
      { name: "Статус", href: "/status" },
      { name: "Администрирование", onClick: handleClick },
    ],
    [handleClick]
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Stack spacing={1} direction="row">
          {navLinks.map(({ name, href, onClick }) => (
            <Button
              key={name}
              sx={{ color: "#fff" }}
              href={href}
              onClick={onClick}
            >
              {name}
            </Button>
          ))}
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {ADMIN_LINKS.map(({ name, href }) => (
              <MenuItem component="a" key={name} href={href}>
                {name}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
