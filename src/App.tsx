import Header from './components/Header';
import Modal from './components/Modal';
import List from './components/List';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { StateProvider } from './context/index';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
      backgroundColor: '#7A9E9F',
    }
  }),
);

const App = () => {
  console.log(process.env)
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <StateProvider>
        <Header />
        <Modal />
        <List />
      </StateProvider>
    </div>
  );
}

export default App;
