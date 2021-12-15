// import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';
import {Fill, Stroke, Style, Text} from 'ol/style';


const googleBaseLayer = new TileLayer({
  source: new XYZ({
    url: 'http://mt{0-3}.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
  }),
})

const ataLayer = new VectorLayer({
  source: new VectorSource({
    url: 'data/geojson/id_foody_202110_nov_gh_ata.geojson',
    format: new GeoJSON(),
  }),
  style: function (feature) {
    var value = feature.get('order_id');
    if(value === 721026916539904510) {
      return new Style({ stroke: new Stroke({
        color: [255,0,0,0.6],
        width: 5,
      }),});
    }
  },
});

const googleLayer = new VectorLayer({
  source: new VectorSource({
    url: 'data/geojson/id_foody_202110_nov_gh_google.geojson',
    format: new GeoJSON(),
  }),
  style: function (feature) {
    var value = feature.get('order_id');
    if(value === 721026916539904510) {
    const extent = feature.getGeometry().getExtent()
    map.getView().fit(extent);
    return new Style({ stroke: new Stroke({
      color: [128,0,128,0.6],
      width: 5,
    }),});}
  },
});

const bikeLayer = new VectorLayer({
  source: new VectorSource({
    url: 'data/geojson/id_foody_202110_nov_gh_bike.geojson',
    format: new GeoJSON(),
  }),
  style: function (feature) {
    var value = feature.get('order_id');
    if(value === 721026916539904510) {
    return new Style({ stroke: new Stroke({
      color: [0,100,0,0.6],
      width: 5,
    }),});}
  },
});

const carLayer = new VectorLayer({
  source: new VectorSource({
    url: 'data/geojson/id_foody_202110_nov_gh_car.geojson',
    format: new GeoJSON(),
  }),
  style: function (feature) {
    var value = feature.get('order_id');
    if(value === 721026916539904510) {
    return new Style({ stroke: new Stroke({
      color: [0,0,128,0.6],
      width: 5,
    }),});}
  },
});

const map = new Map({
  layers: [googleBaseLayer,ataLayer,googleLayer,bikeLayer,carLayer],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 1,
  }),
});

const highlightStyle = new Style({
  stroke: new Stroke({
    color: '#f00',
    width: 2,
  }),
  fill: new Fill({
    color: 'rgba(255,0,0,0.1)',
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: '#000',
    }),
    stroke: new Stroke({
      color: '#f00',
      width: 3,
    }),
  }),
});

const featureOverlay = new VectorLayer({
  source: new VectorSource(),
  map: map,
  style: function (feature) {
    highlightStyle.getText().setText(feature.get('order_id'));
    return highlightStyle;
  },
});

let highlight;
const displayFeatureInfo = function (pixel) {
  const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
    return feature;
  });

  const info = document.getElementById('info');
  if (feature) {
    info.innerHTML = feature.get('order_id');
  } else {
    info.innerHTML = '&nbsp;';
  }

  if (feature !== highlight) {
    if (highlight) {
      featureOverlay.getSource().removeFeature(highlight);
    }
    if (feature) {
      featureOverlay.getSource().addFeature(feature);
    }
    highlight = feature;
  }
};

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  const pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel);
});

map.on('click', function (evt) {
  displayFeatureInfo(evt.pixel);
});
