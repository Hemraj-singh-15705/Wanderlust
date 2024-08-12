mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  center: Listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});


const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(Listing.geometry.coordinates) // geometry.listing.coordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${Listing.location}</h4><P>Exact Location will be provided after booking</P>`
    )
  )

  .addTo(map);
