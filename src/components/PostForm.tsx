import { fi } from 'date-fns/locale';
import { LatLng } from 'leaflet';
import { ChangeEvent, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CancelIcon from '@material-ui/icons/Cancel';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import { ModalTypes } from '../context/actions';
import { createItem, getItems, store, updateItem } from '../context/index';
import { fishSelect, weatherSelect, windSelect } from '../helpers/lists';
import Map from './Map';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  textarea: {
    resize: "both",
    color: 'black'
  },
  rowContainer: {
    display: "flex",
    alignItems: "center",
    columnGap: 8
  },
  map: {
    height: 250,
    marginTop: 15,
    borderRadius: 5,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#4A6572',
    color: 'white'
  },
  inputEmpty: {
    color: 'white'
  }
}));

interface IPostForm {
  modalData?: any;
  readOnly?: boolean;
  type: ModalTypes;
  setReadOnly?: (value: boolean) => void;
  handleModalClose: () => void;
}

const PostForm = (props: IPostForm) => {
  const { modalData } = props;
  const classes = useStyles();
  const { dispatch } = useContext(store);

  const [form, setForm] = useState(modalData || {
    title: '',
    description: '',
    date: new Date(),
    fishes: [{
      id: 1,
      fishSpecies: null,
      lenth: null,
      time: null
    }]
  });

  const [clickedLocation, setClickedLocation] = useState<LatLng | null>(modalData?.location as LatLng || null);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { currentTarget, target } = e;
    if (currentTarget.name) {
      setForm({ ...form, [currentTarget.name]: currentTarget.value });;
    } else if (target) {
      setForm({ ...form, [target.name]: target.value });
    }
  };

  const handleFishDetailChange = (e: React.ChangeEvent<{ name?: string; value: unknown; } | HTMLInputElement>, id: number) => {
    const { target, currentTarget } = e;
    if (currentTarget.name) {
      const fishes = form.fishes.map((fish: any) => {
        return fish.id === id ? { ...fish, ...{ [currentTarget.name!]: currentTarget.value } } : fish;
      });
      setForm({ ...form, fishes: fishes });
    } else if (target) {
      const fishes = form.fishes.map((fish: any) => {
        return fish.id === id ? { ...fish, ...{ [target.name!]: target.value } } : fish;
      });
      setForm({ ...form, fishes: fishes });
    }
  };

  const handleDate = (date: any) => setForm({ ...form, date: date });

  const handleAddFishRow = () => setForm({ ...form, fishes: [...form.fishes, { id: form.fishes.length + 1 }] });

  const handleDeleteFishRow = (id: number) => setForm({ ...form, fishes: form.fishes.filter((fish: any) => fish.id !== id) });

  const handleSubmit = () => {
    if (props.readOnly) {
      props.setReadOnly && props.setReadOnly(false);
    } else if (props.type === 'NEW_DIARY_POST' && !!form.title && !!form.description && !!clickedLocation) {
      createItem(dispatch, { ...form, location: clickedLocation }).then(res => {
        toast.success('Kirjaus tallennettu!');
        props.handleModalClose();
        getItems(dispatch);
      }).catch(() => {
        toast.error('Jokin meni vikaan.. 😢');
      })
    } else if (props.type === 'VIEW_DIARY_POST') {
      updateItem({ ...form, location: clickedLocation }).then(() => {
        getItems(dispatch);
        props.handleModalClose();
        props.setReadOnly && props.setReadOnly(true);
        toast.success('Muutos tallennettu!');
      }).catch(() => {
        toast.error('Jokin meni vikaan.. 😢');
      })
    }
  };

  return (
    <Container maxWidth="xl">
      <div className={classes.paper}>
        <div className={classes.form}>
          <div className={classes.rowContainer}>
            <TextField
              inputProps={{
                readOnly: props.readOnly
              }}
              variant="outlined"
              margin="normal"
              fullWidth
              id="title"
              label="Otsikko"
              name="title"
              autoFocus
              value={form?.title || ''}
              onChange={handleInput}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fi}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                autoOk
                inputVariant="outlined"
                readOnly={props.readOnly}
                format="d.M.yyyy"
                margin="normal"
                label="Päiväys"
                fullWidth
                value={form.date}
                InputProps={{
                  readOnly: props.readOnly
                }}
                onChange={handleDate}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </div>

          <div className={classes.rowContainer}>
            <TextField
              label="Sää"
              variant="outlined"
              margin="normal"
              name="weather"
              fullWidth
              select
              SelectProps={{
                className: classes.textarea,
                value: form?.weather || '',
                readOnly: props.readOnly,
                onChange: (e: any) => handleInput(e),
              }}
            >
              {
                weatherSelect.map((weather: string) =>
                  <MenuItem key={weather} value={weather}>{weather}</MenuItem>
                )
              }
            </TextField>
            <TextField
              label="Tuuli"
              variant="outlined"
              margin="normal"
              name="wind"
              fullWidth
              select
              SelectProps={{
                className: classes.textarea,
                value: form?.wind || '',
                readOnly: props.readOnly,
                onChange: (e: any) => handleInput(e),
              }}
            >
              {
                windSelect.map((wind: string) =>
                  <MenuItem key={wind} value={wind}>{wind}</MenuItem>
                )
              }
            </TextField>
          </div>

          {(form.fishes || []).map((fish: any) =>
            <div key={fish.id} className={classes.rowContainer}>
              <TextField
                label="Kalalaji"
                variant="outlined"
                margin="normal"
                fullWidth
                name="fishSpecies"
                select
                SelectProps={{
                  className: classes.textarea,
                  value: fish?.fishSpecies || '',
                  readOnly: props.readOnly,
                  onChange: (e: any) => handleFishDetailChange(e, fish.id),
                }}
              >
                {
                  fishSelect.map((fish: string) =>
                    <MenuItem key={fish} value={fish}>{fish}</MenuItem>
                  )
                }
              </TextField>

              <TextField
                variant="outlined"
                margin="normal"
                name="length"
                label="Pituus cm"
                type="number"
                fullWidth
                id="length"
                inputProps={{
                  className: classes.textarea,
                  readOnly: props.readOnly,
                  min: 0
                }}
                value={fish?.length || ''}
                onChange={(e: any) => handleFishDetailChange(e, fish.id)}
              />

              <TextField
                variant="outlined"
                label="Aika"
                type="time"
                name="time"
                margin="normal"
                fullWidth
                value={fish?.time || ''}
                InputProps={{
                  readOnly: props.readOnly,
                  className: fish?.time ? '' : classes.inputEmpty
                }}
                onChange={(e) => {
                  handleFishDetailChange(e, fish.id);
                }}
              />

              {!props.readOnly && (
                form.fishes.length === fish.id ?
                  <IconButton
                    style={{
                      padding: 2,
                      color: '#4A6572'
                    }}
                    onClick={handleAddFishRow}
                  >
                    <AddBoxIcon fontSize="medium" />
                  </IconButton>
                  :
                  <IconButton
                    style={{
                      color: '#95A5A6',
                      padding: 2
                    }}
                    onClick={() => handleDeleteFishRow(fish.id)}
                  >
                    <CancelIcon fontSize="medium" />
                  </IconButton>
              )}
            </div>
          )}

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            multiline
            name="description"
            label="Lisätietoja"
            type="textfield"
            id="description"
            inputProps={{
              className: classes.textarea,
              readOnly: props.readOnly
            }}
            value={form?.description || ''}
            onChange={handleInput}
          />

          <Map
            className={classes.map}
            readOnly={props.readOnly}
            setClickedLocation={setClickedLocation}
            clickedLocation={clickedLocation}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
            disabled={
              props.readOnly ?
                false :
                !(!!form?.title &&
                  !!form?.description &&
                  !!clickedLocation &&
                  !!form?.date &&
                  !!form?.weather &&
                  !!form?.wind)
            }
            onClick={handleSubmit}
          >
            {props.type === 'VIEW_DIARY_POST' ?
              props.readOnly ?
                'Muokkaa' : 'Tallenna'
              : 'Lisää Kirjaus'
            }
          </Button>
        </div>
      </div>
    </Container >
  );
};

export default PostForm;