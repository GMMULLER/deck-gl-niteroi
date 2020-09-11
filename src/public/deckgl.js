const {DeckGL, ScatterplotLayer, GeoJsonLayer} = deck;

var dataset = d3.json('https://opendata.arcgis.com/datasets/36e4cfc1af174323b162b0716cc386fe_35.geojson'); //returns a promisse
var last_objectid_selected = 1;

const redeMonitoramentoDefCiv = new GeoJsonLayer({
  id: 'redeMDC',
  data: 'https://opendata.arcgis.com/datasets/d49e031924a14c24a2ba5c2ed314fb4d_85.geojson',
  opacity: 1,
  pointRadiusMinPixels: 6,
  pickable: true,
  getFillColor: [0, 255, 0]

});

const areaProtPermDec = new GeoJsonLayer({
  id: 'areaPPD',
  data: 'https://opendata.arcgis.com/datasets/36e4cfc1af174323b162b0716cc386fe_35.geojson',
  opacity: 0.8,
  pickable: true,
  stroked: true,
  getFillColor: [107, 242, 224],
  getLineColor: [255, 0, 0],
  onClick: (info, event) => reloadBarChart(info.object.properties.OBJECTID)
});

const deckgl = new DeckGL({
  mapboxApiAccessToken: 'pk.eyJ1IjoiZ21tb3JlaXJhIiwiYSI6ImNrZDlnbmJrODBlY2cyc3NnazVscjJwcDgifQ.WNhHLBY6bfT9Ud-uaIQX3w',
  mapStyle: 'mapbox://styles/mapbox/dark-v10',
  initialViewState: {
    longitude: -43.13,
    latitude: -22.9,
    zoom: 14,
    minZoom: 13,
    maxZoom: 17,
    pitch: 0 //40.5
  },
  controller: true,
  layers: [
    redeMonitoramentoDefCiv,
    areaProtPermDec
  ],
  getTooltip
});

function getTooltip({object}){
  return object && `OBJECTID: ${object.properties.OBJECTID}`;
}

function reloadBarChart(OBJECTID){
  last_objectid_selected = OBJECTID;
  dataset.then(plotBarChart);
}
