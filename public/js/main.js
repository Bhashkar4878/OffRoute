const {
  Map: OlMap,
  View,
  Feature,
  Overlay,
  geom: { Point },
  layer: { Tile: TileLayer, Vector: VectorLayer },
  source: { OSM, Vector: VectorSource },
  style: { Icon, Style },
  proj: { fromLonLat },
} = ol;

const mapElement = document.getElementById('map');
const longitude = Number(mapElement.dataset.lon);
const latitude = Number(mapElement.dataset.lat);
const label = mapElement.dataset.label;

if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
  throw new Error('Cannot initialize map: listing coordinates are invalid.');
}

const coordinates = [longitude, latitude];

// Initialize map
const map = new OlMap({
  target: mapElement,
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: fromLonLat(coordinates),
    zoom: 12,
  }),
});

// Create marker
const marker = new Feature({
  geometry: new Point(fromLonLat(coordinates)),
  name: label,
});

marker.setStyle(new Style({
  image: new Icon({
    src: 'https://cdn-icons-png.flaticon.com/256/684/684908.png',
    scale: 0.2,
  }),
}));

// Add marker to vector layer
const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [marker],
  }),
});
map.addLayer(vectorLayer);

// Create popup overlay
const popupElement = document.getElementById('popup');
const popupOverlay = new Overlay({
  element: popupElement,
  positioning: 'bottom-center',
  offset: [0, -15],
});
map.addOverlay(popupOverlay);

// Show popup on hover
map.on('pointermove', function (event) {
  const feature = map.forEachFeatureAtPixel(event.pixel, function (feat) {
    return feat;
  });

  if (feature && feature.get('name')) {
    const coord = feature.getGeometry().getCoordinates();
    popupOverlay.setPosition(coord);
    popupElement.innerHTML = `<p><b>${feature.get('name')}</b></p><i>Exact location after booking</i>`;
    popupElement.style.display = 'block';
  } else {
    popupElement.style.display = 'none';
  }
});