import './App.css';
import React, { useEffect } from 'react';
import {
  MapsComponent,
  LayersDirective,
  LayerDirective,
  MarkersDirective,
  MarkerDirective,
  NavigationLinesDirective,
  NavigationLineDirective,
  Marker,
  NavigationLine,
  Zoom,
  Inject,
} from '@syncfusion/ej2-react-maps';


function App() {
  var source;
  var destination;
  var mapsInstance;
  
  useEffect(() => {
      if (window.google && window.google.maps) {
        initMap();
      }
  });

  function initMap() {
    const directionsService = new window.google.maps.DirectionsService();
    const onButtonClick = function (event) {
      source = document.getElementById('input').value.toLowerCase();
      destination = document.getElementById('output').value.toLowerCase();
      if (
        source !== '' &&
        source !== null &&
        destination !== '' &&
        destination !== null
      ) {
        calculateAndDisplayRoute(directionsService);
      }
    };
    document.getElementById('route').addEventListener('click', onButtonClick);
  }

  function calculateAndDisplayRoute(directionsService) {
    directionsService
      .route({
        origin: {
          query: source,
        },
        destination: {
          query: destination,
        },
        travelMode: window.google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        mapsInstance.zoomSettings.shouldZoomInitially = true;
        var markers = mapsInstance.layersCollection[0].markerSettings;
        markers[0].dataSource = [];
        markers[0].dataSource.push({
          latitude: response.routes[0].legs[0].start_location.lat(),
          longitude: response.routes[0].legs[0].start_location.lng(),
        });
        markers[0].dataSource.push({
          latitude: response.routes[0].legs[0].end_location.lat(),
          longitude: response.routes[0].legs[0].end_location.lng(),
        });
        var navigationlines =
          mapsInstance.layersCollection[0].navigationLineSettings;
        var latLngs = response.routes[0].overview_path;
        var latitudes = [];
        var longitudes = [];
        for (var i = 0; i < latLngs.length; i++) {
          latitudes.push(latLngs[i].lat());
          longitudes.push(latLngs[i].lng());
        }
        navigationlines[0].latitude = latitudes;
        navigationlines[0].longitude = longitudes;
      })
      .catch((e) => window.alert('Directions request failed due to '));
  }
  return (
    <div>
      <MapsComponent
        zoomSettings={{
          enable: true,
        }}
        ref={(g) => (mapsInstance = g)}
      >
        <Inject services={[Marker, NavigationLine, Zoom]} />
        <LayersDirective>
          <LayerDirective urlTemplate="https://tile.openstreetmap.org/level/tileX/tileY.png">
            <MarkersDirective>
              <MarkerDirective
                visible={true}
                height={20}
                width={20}
                shape="Image"
                imageUrl="https://ej2.syncfusion.com/react/demos/src/maps/images/ballon.png"
              ></MarkerDirective>
            </MarkersDirective>
            <NavigationLinesDirective>
              <NavigationLineDirective
                visible={true}
                color="black"
                angle={0}
                width={2}
              />
            </NavigationLinesDirective>
          </LayerDirective>
        </LayersDirective>
      </MapsComponent>
    </div>
  );
}

export default App;
