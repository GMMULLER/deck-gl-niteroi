const {DeckGL, ScatterplotLayer, GeoJsonLayer, TerrainLayer} = deck;

var dataset = d3.json('https://opendata.arcgis.com/datasets/36e4cfc1af174323b162b0716cc386fe_35.geojson'); //returns a promisse
var last_objectid_selected = 1; //Ultima area de protecao selecionada para exibicao do grafico

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

const niteroiTerrain = new TerrainLayer({
  elevationDecoder: {
    rScaler: 6553.6,
    gScaler: 25.6,
    bScaler: 0.1,
    offset: -10000
  },
  elevationData: 'raster-niteroi-terrain.png'
  // bounds: [-122.5233, 37.6493, -122.3566, 37.8159],
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
    // redeMonitoramentoDefCiv,
    // areaProtPermDec
    niteroiTerrain
  ],
  // getTooltip //Estabelece um tooltip para todos os objetos das camadas
});

function getTooltip({object}){ //Define o que sera exebido na tooltip
  return object && `OBJECTID: ${object.properties.OBJECTID}`;
}

function reloadBarChart(OBJECTID){ //Recarrega o grafico de barras referente as areas de protecao permanente
  last_objectid_selected = OBJECTID;
  d3.select("input#simpleChart").property("checked", true); //Atualiza os botoes de selecao para serem iguais ao grafico exibido
  dataset.then(plotBarChart); //Se os dados foram carregados plota o grafico
}
