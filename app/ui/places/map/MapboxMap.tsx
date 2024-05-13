'use client';
import { useEffect, useState } from 'react';
import { Coordinates, PlaceMap } from '@/app/dashboard/places/interfaces';
import PopupEditPlace from './PopupEditPlace';
import PopupAddPlace from './PopupAddPlace';
import {
  FullscreenControl,
  GeolocateControl,
  Map,
  MapLayerMouseEvent,
  Marker,
} from 'react-map-gl';
import Spinner from '@/app/ui/spinner';
import Image from 'next/image';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapboxMap({ places }: { places: PlaceMap[] }) {
  const mapboxToken =
    'pk.eyJ1IjoibW9udW0iLCJhIjoiY2x1cGNydm4wMDJydzJpcXFzOGV5c2U0NiJ9.uH-MoEW-Nmu5cwRkuqH1sQ';
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<PlaceMap | null>(null);
  const [onAddPlaceCoordinates, setOnAddPlaceCoordinates] =
    useState<Coordinates | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 2.154007,
    latitude: 41.390205,
    zoom: 3.5,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setViewState({
          longitude,
          latitude,
          zoom: 14,
        });
        setIsLoading(false);
      },
      () => {
        console.error('Failed to fetch user location.');
        setViewState({
          longitude: 2.154007,
          latitude: 41.390205,
          zoom: 14,
        });
        setIsLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    setSelectedPlace(null);
  }, [places]);

  return isLoading ? (
    <Spinner />
  ) : (
    <Map
      {...viewState}
      mapboxAccessToken={mapboxToken}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
      attributionControl={false}
      onClick={(e: MapLayerMouseEvent) => {
        setSelectedPlace(null);
        setOnAddPlaceCoordinates(e.lngLat);
      }}
    >
      <FullscreenControl />
      <GeolocateControl />
      {places.map((place) => (
        <Marker
          key={place.id}
          anchor="bottom"
          latitude={place.address.coordinates.lat}
          longitude={place.address.coordinates.lng}
          onClick={(e: any) => {
            setSelectedPlace(place);
            setOnAddPlaceCoordinates(null);
            e.originalEvent.stopPropagation();
          }}
          style={{ cursor: 'pointer' }}
        >
          <Image
            src={
              selectedPlace?.id !== place.id
                ? `/map_marker_importance_${place.importance}.png`
                : `/map_marker_importance_${place.importance}_selected.png`
            }
            alt={`Marker for ${place.name}`}
            width={50}
            height={50}
          />
        </Marker>
      ))}

      {selectedPlace ? (
        <PopupEditPlace
          place={selectedPlace}
          closePopup={() => {
            setSelectedPlace(null);
          }}
        />
      ) : onAddPlaceCoordinates ? (
        <PopupAddPlace
          coordinates={onAddPlaceCoordinates}
          closePopup={() => {
            setOnAddPlaceCoordinates(null);
          }}
        />
      ) : null}
    </Map>
  );
}
