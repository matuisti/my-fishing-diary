import Box from '@material-ui/core/Box';
import {
  createTheme, createStyles, makeStyles, Theme, ThemeProvider
} from '@material-ui/core/styles';
import { styled } from '@material-ui/styles';

import Header from './components/Header';
import Modal from './components/Modal';
import PostList from './components/PostList';
import Protected from './components/Protected';
import Toast from './components/Toast';
import { StateProvider } from './context/index';

const ContentBox = styled(Box)(({
  paddingTop: 80
}))

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
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
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
    <Box className={classes.root}>
      <ThemeProvider theme={theme}>
        <Toast />
        <StateProvider>
          <Header />
          <Modal />
          <ContentBox>
            <Protected
              notLoggedIn={
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight="90vh">
                  <img style={{ maxWidth: 300 }} className={classes.image} src="./fish.png" alt="AppLogo" />
                </Box>
              }
            >
              <PostList />
            </Protected>
          </ContentBox>
        </StateProvider>
      </ThemeProvider>
    </Box>
  );
}

export default App;
