mapboxgl.accessToken = 'pk.eyJ1IjoiZ21tb3JlaXJhIiwiYSI6ImNrZDlnbmJrODBlY2cyc3NnazVscjJwcDgifQ.WNhHLBY6bfT9Ud-uaIQX3w';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: [-43.13, -22.9], // starting position [lng, lat]
    zoom: 9 // starting zoom
});