export type Visit = {
  id: string
  place: string
  region: string
  title: string
  date: string
  year: number
  images: string[]
  videos: number
  cover: string
  note: string
}

export type Moment = {
  src: string
  alt: string
  place: string
  date: string
}

export type Place = {
  name: string
  region: string
  visits: number
}

export type ArchiveData = {
  stats: {
    places: number
    trips: number
    moments: number
  }
  heroImage: string
  places: Place[]
  visits: Visit[]
  gallery: Moment[]
}
