import { ChangeEvent, useContext, useEffect, useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import MuiAlert from '@material-ui/lab/Alert';

import { handleModal, login, register, store } from '../context/index';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tabs: {
    marginBottom: theme.spacing(4),
    width: '100%'
  },
  alert: {
    fontSize: 15,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

type user = {
  username?: string;
  error?: string;
}

const LoginForm = () => {
  const classes = useStyles();
  const { dispatch, state } = useContext(store);

  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState<user | null>(null);
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { currentTarget: { name, value } } = e;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    if (!!form.username && !!form.password) {
      if (tabValue === 0) {
        login(dispatch, form)
          .catch((err) => {
            setUser({ error: 'Jäyttäjätunnus tai salasana on virheellinen' });
          });
      } else if (tabValue === 1) {
        register(dispatch, form).then((res) => {
          setUser({ username: res.username });
          setTabValue(0);
        }).catch((err) => {
          if (err?.response?.data?.description) {
            setUser({ error: 'Käyttäjätunnus on jo olemassa' });
          } else {
            setUser({ error: 'Jokin meni vikaan' });
          }
        });
      }
    }
  };

  useEffect(() => {
    if (!!state.user) {
      handleModal(dispatch, { type: 'LOGIN', active: false });
    }
  }, [state.user, dispatch]);

  return (
    <Container component="main" maxWidth="xs">
      <Tabs
        className={classes.tabs}
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        centered
      >
        <Tab label="Kirjaudu" />
        <Tab label="Luo tunnus" />
      </Tabs>
      {user?.username &&
        <MuiAlert className={classes.alert} elevation={6} variant="filled" severity="success">
          Käyttäjä {user?.username} luotu onnistuneesti, kirjaudu sisään!
        </MuiAlert>
      }
      {user?.error &&
        <MuiAlert className={classes.alert} elevation={6} variant="filled" severity="error">
          {user?.error}
        </MuiAlert>
      }
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOpenIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {tabValue === 0 ?
            'Kirjaudu sisään' :
            'Luo tunnus'
          }
        </Typography>

        <div className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Käyttäjätunnus"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={handleInput}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Salasana"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleInput}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            {tabValue === 0 ?
              'Kirjaudu' :
              'Rekisteröidy'
            }
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default LoginForm;