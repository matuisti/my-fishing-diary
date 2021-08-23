import { MouseEvent, useContext, useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import MenuIcon from '@material-ui/icons/Menu';

import { handleModal, logout, store } from '../context/index';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: '#232F34',
    },
    title: {
      flexGrow: 1,
    },
    userLabel: {
      marginRight: theme.spacing(3),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  }),
);

const Header = () => {
  const { state, dispatch } = useContext(store);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const classes = useStyles();

  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    if (!state.user) {
      handleModal(dispatch, { type: 'LOGIN', active: true });
    } else {
      logout(dispatch, state.user.token);
    }
  };


  return (
    <div>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Kalapäiväkirja
          </Typography>
          {!!state.user?.username &&
            <Typography
              className={classes.userLabel}
            >
              {state.user.username}
            </Typography>
          }
          {!!state.user &&
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => {
                handleModal(dispatch, { type: 'NEW_DIARY_POST', active: true });
              }}>
              <AddCircleIcon />
            </IconButton>
          }
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}>
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profiili</MenuItem>
            <MenuItem onClick={handleClick}>{state.user ? 'Kirjaudu ulos' : 'Kirjaudu sisään'}</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;