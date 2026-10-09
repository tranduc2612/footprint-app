import type { Place } from '../types/archive'

type PlacesMapProps = {
  places: Place[]
  selectedPlace: string
  onSelectPlace: (name: string) => void
}

const bounds = { west: 103, east: 107.8, south: 19.55, north: 23.05 }
const labelPositions: Record<string, string> = {
  'Sa Pa': 'east',
  'Ninh Bình': 'north',
  'Hạ Long': 'west',
}

function getPosition(place: Place) {
  const x = ((place.longitude - bounds.west) / (bounds.east - bounds.west)) * 100
  const y = ((bounds.north - place.latitude) / (bounds.north - bounds.south)) * 100
  return { left: `${x}%`, top: `${y}%` }
}

export default function PlacesMap({ places, selectedPlace, onSelectPlace }: PlacesMapProps) {
  return (
    <figure className="places-map" data-reveal="right" aria-label="Bản đồ những nơi chúng mình đã ghé thăm ở miền Bắc Việt Nam">
      <div className="places-map-canvas">
        <svg className="map-artwork" aria-hidden="true" viewBox="0 0 760 480" preserveAspectRatio="none">
          <path className="map-land" d="M0 0h760v480H0z" />
          <path className="map-water" d="M580-12c27 24-5 43 24 69 27 24-2 38 20 62 25 26-8 40 19 64 28 26-11 46 16 70 28 25-17 45 12 70 28 25-5 39 28 61 22 17 10 40 36 56v20H565z" />
          <path className="map-coast" d="M580-12c27 24-5 43 24 69 27 24-2 38 20 62 25 26-8 40 19 64 28 26-11 46 16 70 28 25-17 45 12 70 28 25-5 39 28 61 22 17 10 40 36 56" />

          <g className="map-contours" fill="none">
            <path d="M-35 89c72-39 119-47 188-13s101 41 154 14 117-25 184 8" />
            <path d="M-28 111c70-34 122-38 179-10s106 42 163 17 114-26 177 6" />
            <path d="M-16 136c66-31 113-31 169-7s107 42 168 18 114-27 170 3" />
            <path d="M-38 286c72-34 133-32 198-4s109 36 164 9 108-26 159 1" />
            <path d="M-28 309c74-30 131-28 188-5s111 36 169 11 104-25 153-1" />
            <path d="M-21 334c66-26 121-25 180-4s115 34 169 12 104-25 150-4" />
          </g>

          <g className="map-roads" fill="none">
            <path d="M74 0c38 76 88 112 157 146s113 61 153 107 66 91 111 125" />
            <path d="M311 0c-6 71 10 116 42 161s41 99 30 157 7 108 43 162" />
            <path d="M0 219c85 6 150 28 218 66s111 57 183 56 131 11 185 40" />
            <path d="M496 0c-18 70-14 128 12 179s55 87 89 127" />
          </g>

          <g className="map-rivers" fill="none">
            <path d="M94 26c53 39 82 61 113 95s54 51 94 63 63 25 99 55 58 43 94 51" />
            <path d="M260 91c-13 31-8 59 16 83s41 28 63 52 35 51 33 83" />
          </g>

          <g className="map-islands">
            <path d="M685 174c10-8 18-5 22 2-7 7-16 8-22-2Zm28 25c8-6 15-4 18 2-5 6-12 7-18-2Zm-3 47c11-7 19-4 20 3-8 5-15 5-20-3Zm24 27c7-5 13-3 15 2-5 5-10 5-15-2Zm-36 34c10-6 17-3 19 3-6 5-14 4-19-3Z" />
          </g>
        </svg>

        <span className="map-place-label map-place-label-hanoi">HÀ NỘI</span>
        <span className="map-place-label map-place-label-bay">VỊNH BẮC BỘ</span>
        <span className="map-region-label map-region-label-northwest">LÀO CAI</span>
        <span className="map-region-label map-region-label-southeast">QUẢNG NINH</span>
        <span className="map-compass" aria-hidden="true"><span>N</span><i /></span>

        {places.map((place, index) => (
          <button
            className={`map-marker map-marker-${labelPositions[place.name] ?? 'east'} ${selectedPlace === place.name ? 'is-selected' : ''}`}
            key={place.name}
            type="button"
            style={getPosition(place)}
            onClick={() => onSelectPlace(place.name)}
            aria-label={`${place.name}, ${place.region}, ${place.visits} lần ghé. Lọc album theo địa điểm này.`}
            aria-pressed={selectedPlace === place.name}
          >
            <span className="map-marker-point"><span>{String(index + 1).padStart(2, '0')}</span></span>
            <span className="map-marker-label">
              <strong>{place.name}</strong>
              <small>{place.visits} {place.visits === 1 ? 'chuyến' : 'chuyến đi'}</small>
            </span>
          </button>
        ))}

        <div className="places-map-heading">
          <span>NHỮNG NƠI ĐÃ ĐI QUA</span>
          <strong>Miền Bắc, Việt Nam</strong>
        </div>
        <div className="places-map-coordinate" aria-hidden="true">20°–23°B&nbsp;&nbsp; 103°–108°Đ</div>
      </div>
      <figcaption className="places-map-caption">
        <span><i aria-hidden="true" /> {places.length} địa điểm đã ghé thăm</span>
        <span>Chạm vào điểm để xem album</span>
      </figcaption>
    </figure>
  )
}
