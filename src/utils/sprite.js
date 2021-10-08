async function dataLocation(map, lat, long) {
  // map.current.flyTo({
  //   center: [long, lat],
  //   speed: 0.5,
  // });

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [long, lat],
        },
      },
    ],
  };
}

export { dataLocation };
