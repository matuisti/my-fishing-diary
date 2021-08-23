import { useEffect, useRef, HTMLAttributes } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { makeStyles } from '@material-ui/core/styles';
import LocationOnIcon from '@material-ui/icons/LocationOn'
import MyLocationIcon from '@material-ui/icons/MyLocation';
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from 'leaflet';

const useStyles = makeStyles((theme) => ({
  controlIcon: {
    textAlign: 'center',
    verticalAlign: 'middle',
    justifyContent: 'center',
    width: 19,
    height: 19
  },
  mapIcon: {
    textAlign: 'center',
    verticalAlign: 'middle',
    justifyContent: 'center',
    width: 25,
    height: 25
  }
}));

interface IMapProps extends HTMLAttributes<HTMLDivElement> {
  clickedLocation: LatLng | null;
  setClickedLocation?: (latlng: LatLng) => void
};

const Map = (props: IMapProps) => {
  const classes = useStyles();
  const mapRef = useRef<L.Map | null>(null);
  const myLocationRef = useRef<L.Marker | null>(null);
  const clickedLocationRef = useRef<L.Marker | null>(null);

  const initMap = () => {
    mapRef.current = L.map('map', {
      center: [props.clickedLocation?.lat || 64.467261, props.clickedLocation?.lng || 26.577317],
      zoom: 4,
      layers: [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png'),
      ]
    });

    const customControl = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: () => {
        const container = L.DomUtil.create('button');
        container.style.backgroundColor = 'white';
        container.style.width = '32px';
        container.style.height = '32px';
        container.style.borderRadius = '3px';
        container.style.border = '1px solid #ccc';
        container.style.padding = '0px';
        container.style.cursor = 'pointer';
        container.onclick = findMylocation;
        const icon = L.DomUtil.create('div');
        icon.innerHTML = renderToStaticMarkup(<MyLocationIcon className={classes.controlIcon} />);
        container.appendChild(icon);
        return container;
      }
    });
    mapRef.current.addControl(new customControl());
    mapRef.current.on('click', onMapClick);
    if (props.clickedLocation) {
      createMarkerOnMap(props.clickedLocation);
    }
  };

  useEffect(() => {
    initMap();
    return () => {
      mapRef.current?.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const findMylocation = () => {
    mapRef.current?.locate({ setView: true, watch: true }).on('locationfound', (e) => {
      if (myLocationRef.current) {
        myLocationRef.current?.setLatLng([e.latlng.lat, e.latlng.lng]);
      } else {
        myLocationRef.current = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: renderToStaticMarkup(<LocationOnIcon className={classes.mapIcon} />),
            iconSize: [30, 30],
          })
        });
        mapRef.current?.addLayer(myLocationRef.current);
      }
    }).on('locationerror', (e: any) => {
      console.log(e);
    });
  };

  const onMapClick = (e: any) => {
    if (props.setClickedLocation) {
      props.setClickedLocation(e.latlng);
    }
    if (clickedLocationRef.current) {
      mapRef.current?.removeLayer(clickedLocationRef.current);
    }
    createMarkerOnMap(e.latlng);
  }

  const createMarkerOnMap = (latlng: LatLng) => {
    clickedLocationRef.current = L.marker([latlng.lat, latlng.lng], {
      icon: L.divIcon({
        className: 'custom-div-icon',
        html: renderToStaticMarkup(<LocationOnIcon className={classes.mapIcon} />),
        iconSize: [30, 30],
      })
    });
    mapRef.current?.addLayer(clickedLocationRef.current);
  }

  return <div className={props.className} id="map" />;
};

export default Map;