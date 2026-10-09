import archiveJson from './archive.json'
import type { ArchiveData } from '../types/archive'

export const archive = archiveJson as ArchiveData
export const visits = archive.visits
export const places = archive.places
export const moments = archive.gallery
export const years = [...new Set(visits.map((visit) => visit.year))].sort((a, b) => b - a)
