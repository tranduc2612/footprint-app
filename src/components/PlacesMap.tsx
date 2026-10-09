import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, Tooltip, useMap, ZoomControl } from 'react-leaflet'
import type { Place } from '../types/archive'
import { localizedPlace, localizedRegion, useLanguage } from '../content/language'
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
    const container = map.getContainer()
    const fitMap = () => {
      map.invalidateSize({ animate: false, pan: false })
      if (!places.length) return

      if (places.length === 1) {
        map.setView([places[0].latitude, places[0].longitude], 8, { animate: false })
        return
      }

      const bounds = L.latLngBounds(places.map(({ latitude, longitude }) => [latitude, longitude]))
      map.fitBounds(bounds, { padding: [64, 64], maxZoom: 8, animate: false })
    }

    const frame = window.requestAnimationFrame(fitMap)
    const observer = new ResizeObserver(() => map.invalidateSize({ animate: false, pan: false }))
    observer.observe(container)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [map, places])

  return null
}

export default function PlacesMap({ places, selectedPlace, onSelectPlace }: PlacesMapProps) {
  const { language, t } = useLanguage()
  const mappablePlaces = useMemo(() => places.filter(isValidCoordinate), [places])
  const firstPlace = mappablePlaces[0]
  const initialCenter: [number, number] = firstPlace
    ? [firstPlace.latitude, firstPlace.longitude]
    : [16, 108]

  return (
    <figure className="places-map" data-reveal="right" aria-label={t.mapAria}>
      <div className="places-map-heading">
        <span>{t.mapHeading}</span>
        <strong>{t.mapPlacesCount(places.length)}</strong>
      </div>
      <div className="places-map-canvas">
        <MapContainer
          className="places-leaflet-map"
          center={initialCenter}
          zoom={5}
          minZoom={2}
          maxZoom={18}
          scrollWheelZoom={false}
          zoomControl={false}
          aria-label={t.mapInteractive}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitPlacesBounds places={mappablePlaces} />
          <ZoomControl position="topright" zoomInTitle={t.zoomIn} zoomOutTitle={t.zoomOut} />
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
                title={`${localizedPlace(place.name, language)}, ${localizedRegion(place.region, language)}`}
                alt={`${localizedPlace(place.name, language)}, ${t.mapTripCount(place.visits)}`}
              >
                <Tooltip permanent direction="top" offset={[0, -14]} className="places-map-tooltip">
                  <strong>{localizedPlace(place.name, language)}</strong>
                  <span>{t.mapTripCount(place.visits)}</span>
                </Tooltip>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
      <figcaption className="places-map-caption">
        <span><i aria-hidden="true" /> {t.visitedPlacesCount(places.length)}</span>
        <span>{t.mapHint}</span>
      </figcaption>
    </figure>
  )
}
