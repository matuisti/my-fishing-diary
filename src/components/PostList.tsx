import { Fragment, useContext, useEffect } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ImageIcon from '@material-ui/icons/Image';

import { getItems, handleModal, store } from '../context/index';
import { timeFormatter } from '../helpers/helper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingLeft: 40,
      paddingRight: 40,
      marginBottom: 40,
    },
    list: {
      marginTop: 22,
      width: '100%',
      padding: 0,
      backgroundColor: theme.palette.background.paper,
      alignItems: 'center',
      borderRadius: 7,
    },
    addButtonRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 22,
      backgroundColor: theme.palette.background.paper,
      borderRadius: 7,
      width: '100%',
      height: 70,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#F5F5F5',
      },
    },
    largeIcon: {
      width: 36,
      height: 36,
      padding: 12,
      color: '#0000008a'
    }
  })
);

const PostList = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(store);
  useEffect(() => {
    getItems(dispatch);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRowClick = (item: any) => {
    handleModal(dispatch, {
      type: 'VIEW_DIARY_POST',
      active: true,
      modalData: item
    });
  };

  const posts = state.items.sort((a: any, b: any) => {
    return new Date(b.date).valueOf() - new Date(a.date).valueOf()
  });

  return (
    <Container className={classes.container}>
      <Box
        className={classes.addButtonRow}
        onClick={() => handleModal(dispatch, { type: 'NEW_DIARY_POST', active: true })}
      >
        <Grid
          container
          alignItems="center"
        >
          <AddCircleOutlineIcon className={classes.largeIcon} />
          <Typography component="p">Luo uusi kirjaus</Typography>
        </Grid>
        <ArrowForwardIosIcon
          fontSize="small"
          style={{
            color: '#0000008a',
            marginRight: 16,
          }}
        />
      </Box>
      <List className={classes.list}>
        {(posts || []).map((item: any, index: number) =>
          <Fragment key={item.id}>
            <ListItem button onClick={() => handleRowClick(item)}>
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.title} secondary={timeFormatter(item.date)} />
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {index + 1 !== posts.length &&
              <Divider />
            }
          </Fragment>
        )}
      </List>
    </Container>
  );
};

export default PostList;
