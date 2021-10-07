import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './styles.module.scss';

import MapSidebar from './MapSidebar';

mapboxgl.accessToken =
  'pk.eyJ1Ijoic29uMGZhbnRvbiIsImEiOiJja3Vhb2k2YzQwaXB6Mm9vODl3YjA1ZTEyIn0.8a3KACJ4PHJ_rkkVVwg0yA';

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(121.05398662456394);
  const [lat, setLat] = useState(14.607236772149098);
  const [zoom, setZoom] = useState(16.4);
  const bounds = [
    [121.04665882953464, 14.603769139644442],
    [121.0613144195919, 14.610704349961054],
  ];

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/son0fanton/ckugvkfsi3pw817kvm786zpmp',
      center: [lng, lat],
      zoom,
      pitch: 49.62,
      bearing: -145.33,
      maxBounds: bounds,
      antialias: true,
    });

    map.current.on('load', () => {
      // OUTER BOX
      map.current.addSource('mainWrapperSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05020916725448, 14.609554652165913],
                [121.05192327832602, 14.604771371932427],
                [121.0567453066866, 14.606562170136694],
                [121.05484620329813, 14.610741014344544],
                [121.05020916725448, 14.609554652165913],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'mainWrapper',
        type: 'fill',
        source: 'mainWrapperSource', // reference the data source
        layout: {},
        paint: {
          'fill-color': '#ffffff', // blue color fill
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'mainWrapperOutline',
        type: 'line',
        source: 'mainWrapperSource',
        layout: {},
        paint: {
          'line-color': 'blue',
          'line-width': 5,
        },
      });

      // HEALTH SERVICE BOX
      map.current.addSource('healthServiceSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05152113123171, 14.609832611280757],
                [121.0519493602943, 14.610053169678636],
                [121.0523706824365, 14.610213575647201],
                [121.05274365613617, 14.609632103454247],
                [121.05188029109065, 14.609271188905636],
                [121.05152113123171, 14.609832611280757],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'healthService',
        type: 'fill',
        source: 'healthServiceSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'healthServiceOutline',
        type: 'line',
        source: 'healthServiceSource',
        layout: {},
        paint: {
          'line-color': 'yellow',
          'line-width': 5,
        },
      });

      // ENGINEERING SERVICE BOX
      map.current.addSource('engineeringServiceSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05081375453483, 14.60980314119106],
                [121.05144750840897, 14.609948299827522],
                [121.0515602884949, 14.60963671588831],
                [121.0515243296269, 14.609592429810347],
                [121.0509522567273, 14.609462734816388],
                [121.05080515226739, 14.609796462024004],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'engineeringService',
        type: 'fill',
        source: 'engineeringServiceSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'engineeringServiceOutline',
        type: 'line',
        source: 'engineeringServiceSource',
        layout: {},
        paint: {
          'line-color': 'green',
          'line-width': 5,
        },
      });

      // MARITIME GROUP BOX
      map.current.addSource('maritimeGroupSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05100877453363, 14.609395666918852],
                [121.0516016906081, 14.609593840864601],
                [121.05186429132073, 14.609155940132792],
                [121.05120861532752, 14.608924203991085],
                [121.05100877453363, 14.609395666918852],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'maritimeGroup',
        type: 'fill',
        source: 'maritimeGroupSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'maritimeGroupOutline',
        type: 'line',
        source: 'maritimeGroupSource',
        layout: {},
        paint: {
          'line-color': 'red',
          'line-width': 5,
        },
      });

      // INTERNAL AFFAIRS SERVICE BOX
      map.current.addSource('internalAffairsServiceSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05147451919379, 14.60834725982381],
                [121.05158022010959, 14.608396803563286],
                [121.05193200596995, 14.60760729876997],
                [121.0518378660918, 14.607567343998735],
                [121.05147451919379, 14.60834725982381],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'internalAffairsService',
        type: 'fill',
        source: 'internalAffairsServiceSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'internalAffairsServiceOutline',
        type: 'line',
        source: 'internalAffairsServiceSource',
        layout: {},
        paint: {
          'line-color': 'maroon',
          'line-width': 5,
        },
      });

      // DIRECTORATE BOX
      map.current.addSource('directorateSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.0518369944426, 14.608529360410055],
                [121.0520544210868, 14.608633675157954],
                [121.05224992235513, 14.608221720017871],
                [121.05202153302298, 14.608119173124804],
                [121.0518369944426, 14.608529360410055],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'directorate',
        type: 'fill',
        source: 'directorateSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'directorateOutline',
        type: 'line',
        source: 'directorateSource',
        layout: {},
        paint: {
          'line-color': 'orange',
          'line-width': 5,
        },
      });

      // PNP RETIREMENT BOX
      map.current.addSource('pnpRetirementSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.0521239156302, 14.608962913655184],
                [121.0524765418605, 14.60911476798133],
                [121.05254115923253, 14.608977205831538],
                [121.05218484058098, 14.608793193990063],
                [121.0521239156302, 14.608962913655184],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'pnpRetirement',
        type: 'fill',
        source: 'pnpRetirementSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'pnpRetirementOutline',
        type: 'line',
        source: 'pnpRetirementSource',
        layout: {},
        paint: {
          'line-color': 'pink',
          'line-width': 5,
        },
      });

      // NATIONAL HEADQUARTERS BOX
      map.current.addSource('nationalHeadquartersSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05289932409474, 14.609561397755296],
                [121.05339226233292, 14.609840094269385],
                [121.05380212109274, 14.609071891489094],
                [121.0532981055908, 14.608834284035165],
                [121.05289932409474, 14.609561397755296],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'nationalHeadquarters',
        type: 'fill',
        source: 'nationalHeadquartersSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'nationalHeadquartersOutline',
        type: 'line',
        source: 'nationalHeadquartersSource',
        layout: {},
        paint: {
          'line-color': 'violet',
          'line-width': 5,
        },
      });

      // PNP MORTUARY BOX
      map.current.addSource('pnpMortuarySource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05322794958684, 14.608703867791666],
                [121.05341441686043, 14.608764609606299],
                [121.05362857729351, 14.608396585413406],
                [121.05343841759861, 14.608289393785045],
                [121.05322794958684, 14.608703867791666],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'pnpMortuary',
        type: 'fill',
        source: 'pnpMortuarySource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'pnpMortuaryOutline',
        type: 'line',
        source: 'pnpMortuarySource',
        layout: {},
        paint: {
          'line-color': 'cyan',
          'line-width': 5,
        },
      });

      // LEGAL SERVICE BOX
      map.current.addSource('legalServiceSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05341203409245, 14.610359510537167],
                [121.05383454799666, 14.610451687903787],
                [121.0539344149195, 14.610282200457934],
                [121.05353648364243, 14.610074057801793],
                [121.05341203409245, 14.610359510537167],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'legalService',
        type: 'fill',
        source: 'legalServiceSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'legalServiceOutline',
        type: 'line',
        source: 'legalServiceSource',
        layout: {},
        paint: {
          'line-color': 'magenta',
          'line-width': 5,
        },
      });

      // CRIME LABORATORY BOX
      map.current.addSource('crimeLaboratorySource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05256895897031, 14.6076900186175],
                [121.05310165129076, 14.60792432449579],
                [121.05333456005424, 14.60751373117303],
                [121.05278803156963, 14.607254878466723],
                [121.05256895897031, 14.6076900186175],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'crimeLaboratory',
        type: 'fill',
        source: 'crimeLaboratorySource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'crimeLaboratoryOutline',
        type: 'line',
        source: 'crimeLaboratorySource',
        layout: {},
        paint: {
          'line-color': '#B0BF1A',
          'line-width': 5,
        },
      });

      // ANTI-KIDNAPPING BOX
      map.current.addSource('antiKidnappingSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05253898061461, 14.60765877781486],
                [121.05279494965171, 14.607208017166748],
                [121.05252283842309, 14.607085285147459],
                [121.05227609349542, 14.607562823891685],
                [121.05253898061461, 14.60765877781486],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'antiKidnapping',
        type: 'fill',
        source: 'antiKidnappingSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'antiKidnappingOutline',
        type: 'line',
        source: 'antiKidnappingSource',
        layout: {},
        paint: {
          'line-color': '#7CB9E8',
          'line-width': 5,
        },
      });

      // PNP GRANDSTANDT BOX
      map.current.addSource('pnpGrandstandtSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05429386743646, 14.608580379639204],
                [121.05502718413733, 14.608908406475082],
                [121.05563366933333, 14.60785291702984],
                [121.05498106359013, 14.607498110766825],
                [121.05429386743646, 14.608580379639204],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'pnpGrandstandt',
        type: 'fill',
        source: 'pnpGrandstandtSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'pnpGrandstandtOutline',
        type: 'line',
        source: 'pnpGrandstandtSource',
        layout: {},
        paint: {
          'line-color': '#C0E8D5',
          'line-width': 5,
        },
      });

      // ONE STOP SHOP BOX
      map.current.addSource('oneStopShopSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05514479153278, 14.608944110054692],
                [121.0555022257738, 14.609084692809628],
                [121.05555526440308, 14.609002128345399],
                [121.05566364768907, 14.60898204509266],
                [121.05574435864672, 14.608803527209844],
                [121.05528545920183, 14.608633935086889],
                [121.05514479153278, 14.608944110054692],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'oneStopShop',
        type: 'fill',
        source: 'oneStopShopSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'oneStopShopOutline',
        type: 'line',
        source: 'oneStopShopSource',
        layout: {},
        paint: {
          'line-color': '#E52B50',
          'line-width': 5,
        },
      });

      // HIGHWAY PATROL GROUP BOX
      map.current.addSource('highwayPatrolGroupSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05486576222205, 14.606614439840959],
                [121.0556175271418, 14.606960321551416],
                [121.05581353946751, 14.606525179956378],
                [121.05603722412157, 14.606612208344277],
                [121.05616174959906, 14.606319882084316],
                [121.05522089043568, 14.605915980276455],
                [121.05486576222205, 14.606614439840959],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'highwayPatrolGroup',
        type: 'fill',
        source: 'highwayPatrolGroupSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'highwayPatrolGroupOutline',
        type: 'line',
        source: 'highwayPatrolGroupSource',
        layout: {},
        paint: {
          'line-color': '#FFBF00',
          'line-width': 5,
        },
      });

      // EOD K9 GROUP BOX
      map.current.addSource('eodK9GroupSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.05599110357434, 14.607589601738011],
                [121.05625168466617, 14.607694481590872],
                [121.05635776192477, 14.607466869931756],
                [121.05609718083294, 14.607353064013815],
                [121.05599110357434, 14.607589601738011],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'eodK9Group',
        type: 'fill',
        source: 'eodK9GroupSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'eodK9GroupOutline',
        type: 'line',
        source: 'eodK9GroupSource',
        layout: {},
        paint: {
          'line-color': '#CD9575',
          'line-width': 5,
        },
      });

      // LOGISTICS SUPPORT SERVICE BOX
      map.current.addSource('logisticsSupportServiceSource', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [121.0556405874154, 14.606953627079925],
                [121.05642694274559, 14.60729727676704],
                [121.05658605863351, 14.606929080653144],
                [121.05584121179585, 14.606576504402506],
                [121.0556405874154, 14.606953627079925],
              ],
            ],
          },
        },
      });

      map.current.addLayer({
        id: 'logisticsSupportService',
        type: 'fill',
        source: 'logisticsSupportServiceSource',
        layout: {},
        paint: {
          'fill-color': '#ffff00',
          'fill-opacity': 0,
        },
      });

      map.current.addLayer({
        id: 'logisticsSupportServiceOutline',
        type: 'line',
        source: 'logisticsSupportServiceSource',
        layout: {},
        paint: {
          'line-color': '#FF9966',
          'line-width': 5,
        },
      });
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div className={styles.Map}>
      <MapSidebar />

      <div ref={mapContainer} className={styles.Map_container} />
    </div>
  );
};

export default Map;
