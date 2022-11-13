import React from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { AccountCircle, Logout, Notifications } from "@mui/icons-material";

import { useAuth } from "src/hooks/useAuth";

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
  const [anchorAdmin, setAnchorAdmin] = React.useState(null);
  const [anchorProfile, setAnchorProfile] = React.useState(null);
  const { user } = useAuth();
  const openAdmin = Boolean(anchorAdmin);
  const openProfile = Boolean(anchorProfile);

  const handleClickAdmin = (event) => {
    setAnchorAdmin(event.currentTarget);
  };

  const handleClickProfile = (event) => {
    setAnchorProfile(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorAdmin(null);
    setAnchorProfile(null);
  };

  const navLinks = React.useMemo(
    () => [
      { name: "Главная", href: "/" },
      { name: "Поиск заказов", href: "/search" },
      // { name: "Статус", href: "/status" },
      { name: "Администрирование", onClick: handleClickAdmin },
    ],
    [handleClickAdmin]
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Stack spacing={1} direction="row" sx={{ flexGrow: 1 }}>
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
          <Menu anchorEl={anchorAdmin} open={openAdmin} onClose={handleClose}>
            {ADMIN_LINKS.map(({ name, href }) => (
              <MenuItem component="a" key={name} href={href}>
                {name}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
        <Stack spacing={1} direction="row">
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
            href="/notifies"
          >
            <Badge color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <Button
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            endIcon={<AccountCircle />}
            onClick={handleClickProfile}
          >
            <Typography sx={{ textTransform: "lowercase" }}>
              {user?.login}
            </Typography>
          </Button>
        </Stack>
        <Menu anchorEl={anchorProfile} open={openProfile} onClose={handleClose}>
          <ListItem dense>
            <ListItemText
              primary={user?.name}
              secondary={user?.department.name}
            />
          </ListItem>
          <MenuItem component="a" href="/profile">
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            Профиль
          </MenuItem>
          <Divider />
          <MenuItem component="a" href="/logout">
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Выйти
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
