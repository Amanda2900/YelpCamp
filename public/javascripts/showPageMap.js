
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campgroundLocation.geometry.coordinates,
    zoom: 9
  });

  new mapboxgl.Marker()
    .setLngLat(campgroundLocation.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          `<h3>${campgroundLocation.title}</h3><p>${campgroundLocation.location}</p>`
        )
    )
    .addTo(map);