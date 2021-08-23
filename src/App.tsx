import Box from '@material-ui/core/Box';
import {
  createTheme, createStyles, makeStyles, Theme, ThemeProvider
} from '@material-ui/core/styles';

import Header from './components/Header';
import Modal from './components/Modal';
import PostList from './components/PostList';
import Protected from './components/Protected';
import Toast from './components/Toast';
import { StateProvider } from './context/index';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto Condensed',
      'sans-serif'
    ].join(','),
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
      backgroundColor: '#344955',
    },
    image: {
      width: '50%',
    }
  }),
);

const App = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <Toast />
        <StateProvider>
          <Header />
          <Modal />
          <Protected
            notLoggedIn={
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="90vh">
                <img style={{ maxWidth: 300 }} className={classes.image} src="./fish.png" alt="AppLogo" />
              </Box>
            }>
            <PostList />
          </Protected>
        </StateProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
