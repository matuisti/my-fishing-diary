import { ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import { deleteItem, getItems, handleModal, store } from '../context/index';
import { timeFormatter } from '../helpers/helper';
import LoginForm from './LoginForm';
import PostForm from './PostForm';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),

    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Modal = () => {
  const { state, dispatch } = useContext(store);
  const { modal } = state;

  const [readOnly, setReadOnly] = useState<boolean>(true);

  const handleModalClose = () => {
    handleModal(dispatch, { type: null, active: false });
  };

  const handleDelete = () => {
    const { modal: { modalData: { id } } } = state;
    deleteItem(id).then(() => {
      toast.success('Kirjaus poistettu!');
      getItems(dispatch);
      handleModalClose();
    }).catch(() => {
      toast.error('Jokin meni vikaan.. 😢');
    });
  }

  return (
    <Dialog fullWidth={true} onClose={handleModalClose} aria-labelledby="customized-dialog-title" open={modal.active}>
      <DialogTitle id="customized-dialog-title" onClose={handleModalClose}>
        {modal.type === 'LOGIN' &&
          'Kirjaudu sisään'
        }
        {modal.type === 'NEW_DIARY_POST' &&
          'Luo uusi kirjaus'
        }
        {modal.type === 'VIEW_DIARY_POST' &&
          `Kirjaus ${timeFormatter(modal.modalData.date)}`
        }
      </DialogTitle>
      <DialogContent dividers>
        {modal.type === 'LOGIN' &&
          <LoginForm />
        }
        {modal.type === 'NEW_DIARY_POST' &&
          <PostForm
            type={modal.type}
            handleModalClose={handleModalClose}
          />
        }
        {modal.type === 'VIEW_DIARY_POST' &&
          <PostForm
            handleModalClose={handleModalClose}
            modalData={modal.modalData}
            setReadOnly={setReadOnly}
            readOnly={readOnly}
            type={modal.type}
          />
        }
      </DialogContent>
      <DialogActions>
        {modal.type === 'VIEW_DIARY_POST' &&
          <Button autoFocus onClick={handleDelete} color="primary">
            Poista
          </Button>
        }
        <Button
          autoFocus
          onClick={() => {
            setReadOnly(true);
            handleModalClose()
          }}
        >
          Sulje
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;