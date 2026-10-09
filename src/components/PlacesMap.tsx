import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'
import type { Place } from '../types/archive'
import 'leaflet/dist/leaflet.css'

type PlacesMapProps = {
  places: Place[]
  selectedPlace: string
  onSelectPlace: (name: string) => void
}

function isValidCoordinate(place: Place) {
  return Number.isFinite(place.latitude)
    && Number.isFinite(place.longitude)
    && place.latitude >= -90
    && place.latitude <= 90
    && place.longitude >= -180
    && place.longitude <= 180
}

function createPlaceIcon(index: number, selected: boolean) {
  return L.divIcon({
    className: 'places-map-marker-shell',
    html: `<span class="places-map-marker${selected ? ' is-selected' : ''}">${String(index + 1).padStart(2, '0')}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  })
}

function FitPlacesBounds({ places }: { places: Place[] }) {
  const map = useMap()

  useEffect(() => {
    if (!places.length) return

    if (places.length === 1) {
      map.setView([places[0].latitude, places[0].longitude], 8, { animate: false })
      return
    }

    const bounds = L.latLngBounds(places.map(({ latitude, longitude }) => [latitude, longitude]))
    map.fitBounds(bounds, { padding: [64, 64], maxZoom: 8, animate: false })
  }, [map, places])

  return null
}

export default function PlacesMap({ places, selectedPlace, onSelectPlace }: PlacesMapProps) {
  const mappablePlaces = useMemo(() => places.filter(isValidCoordinate), [places])
  const firstPlace = mappablePlaces[0]
  const initialCenter: [number, number] = firstPlace
    ? [firstPlace.latitude, firstPlace.longitude]
    : [16, 108]

  return (
    <figure className="places-map" data-reveal="right" aria-label="Bản đồ những nơi chúng mình đã ghé thăm">
      <div className="places-map-canvas">
        <MapContainer
          className="places-leaflet-map"
          center={initialCenter}
          zoom={5}
          minZoom={2}
          maxZoom={18}
          scrollWheelZoom={false}
          aria-label="Bản đồ tương tác các địa điểm đã ghé thăm"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitPlacesBounds places={mappablePlaces} />
          {mappablePlaces.map((place) => {
            const placeIndex = places.indexOf(place)
            const selected = selectedPlace === place.name

            return (
              <Marker
                key={place.name}
                position={[place.latitude, place.longitude]}
                icon={createPlaceIcon(placeIndex, selected)}
                eventHandlers={{ click: () => onSelectPlace(place.name) }}
                keyboard
                title={`${place.name}, ${place.region}`}
                alt={`${place.name}, ${place.visits} chuyến đi`}
              >
                <Tooltip permanent direction="top" offset={[0, -14]} className="places-map-tooltip">
                  <strong>{place.name}</strong>
                  <span>{place.visits} {place.visits === 1 ? 'chuyến' : 'chuyến đi'}</span>
                </Tooltip>
              </Marker>
            )
          })}
        </MapContainer>

        <div className="places-map-heading">
          <span>NHỮNG NƠI ĐÃ ĐI QUA</span>
          <strong>{places.length} địa điểm trên bản đồ</strong>
        </div>
      </div>
      <figcaption className="places-map-caption">
        <span><i aria-hidden="true" /> {places.length} địa điểm đã ghé thăm</span>
        <span>Chạm vào điểm để xem album</span>
      </figcaption>
    </figure>
  )
}
