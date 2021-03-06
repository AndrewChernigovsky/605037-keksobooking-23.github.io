import { formAdSwitch, onRoomChange, housePrice} from './form.js';
import { makeCard } from './generation.js';

const MAIN_ICON_ADDRESS = './img/main-pin.svg';
const ICON_ADDRESS = './img/pin.svg';

const MIN_PRICE = 1000;

const X_ICON_MAINSIZE_MARKER = 52;
const Y_ICON_MAINSIZE_MARKER = 52;
const X_ICON_MAINANCHOR_MARKER = 52;
const Y_ICON_MAINANCHOR_MARKER = 52;

const iconMainSizeMarker = {
  iconsSize: [X_ICON_MAINSIZE_MARKER, Y_ICON_MAINSIZE_MARKER],
  iconsAnchor: [X_ICON_MAINANCHOR_MARKER, Y_ICON_MAINANCHOR_MARKER],
};

const X_ICON_PINSIZE_MARKER = 40;
const Y_ICON_PINSIZE_MARKER = 40;
const X_ICON_PINANCHOR_MARKER = 20;
const Y_ICON_PINANCHOR_MARKER = 40;

const iconPinSizeMarker = {
  iconsSize: [X_ICON_PINSIZE_MARKER, Y_ICON_PINSIZE_MARKER],
  iconsAnchor: [X_ICON_PINANCHOR_MARKER, Y_ICON_PINANCHOR_MARKER],
};

const addressField = document.querySelector('#address');
const defaultCoord = {
  lat: 35.6895,
  lng: 139.692,
};

const mapCanvas = L.map('map-canvas')
  .on('load', () => {
    formAdSwitch(false);
    housePrice.placeholder = MIN_PRICE ;
    housePrice.min = MIN_PRICE;

    addressField.value = `${defaultCoord.lat.toFixed(5)} , ${defaultCoord.lng.toFixed(5)}`;
    addressField.readOnly = true;

    onRoomChange();
  })
  .setView({
    lat: defaultCoord.lat,
    lng: defaultCoord.lng,
  }, 10);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>',
  },
).addTo(mapCanvas);

const iconMain = L.icon({
  iconUrl: MAIN_ICON_ADDRESS,
  iconSize: iconMainSizeMarker.iconsSize,
  iconAnchor: iconMainSizeMarker.iconsAnchor,
});

const marker = L.marker(
  {
    lat: defaultCoord.lat, lng: defaultCoord.lng,
  },
  {
    icon: iconMain,
    draggable: true,
  },
);

const createMainMarker = () => {

  marker
    .addTo(mapCanvas);

  marker.on('moveend', (evt) => {
    const addressLatLng = evt.target.getLatLng();
    addressField.value = `${addressLatLng.lat.toFixed(5)} , ${addressLatLng.lng.toFixed(5)}`;
  });
};

createMainMarker(defaultCoord);

const pin =  L.layerGroup().addTo(mapCanvas);

const createPins = (point) => {
  point.forEach(({ location, offer, author }) => {
    const iconPin = L.icon({
      iconUrl: ICON_ADDRESS,
      iconSize: iconPinSizeMarker.iconsSize,
      iconAnchor: iconPinSizeMarker.iconsAnchor,
    });

    const markerPin = L.marker({
      lat: location.lat,
      lng: location.lng,
    },
    {
      icon: iconPin,
    },
    );

    markerPin
      .addTo(pin)
      .bindPopup(
        makeCard({ location, offer, author }),
        {
          keepInView: true,
        },
      );
  });
};

export {createPins, marker, defaultCoord, mapCanvas, pin};
