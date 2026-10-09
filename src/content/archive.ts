import archiveJson from './archive.json'
import type { ArchiveData } from '../types/archive'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
const source = archiveJson as ArchiveData

export const archive: ArchiveData = {
  ...source,
  heroImage: assetPath(source.heroImage),
  visits: source.visits.map((visit) => ({
    ...visit,
    cover: assetPath(visit.cover),
    images: visit.images.map(assetPath),
  })),
  gallery: source.gallery.map((moment) => ({ ...moment, src: assetPath(moment.src) })),
}
export const visits = archive.visits
export const places = archive.places
export const moments = archive.gallery
export const years = [...new Set(visits.map((visit) => visit.year))].sort((a, b) => b - a)
