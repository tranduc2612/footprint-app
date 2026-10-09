/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Language = 'vi' | 'en'

const copy = {
  vi: {
    documentTitle: 'Dấu Chân | Album của chúng mình',
    brandSubtitle: 'ALBUM CỦA CHÚNG MÌNH',
    switchLanguage: 'Switch to English',
    skipNavigation: 'Bỏ qua điều hướng',
    quickNavigation: 'Điều hướng nhanh',
    home: 'Đầu trang',
    album: 'Album',
    map: 'Bản đồ địa điểm',
    moments: 'Khoảnh khắc',
    homeLink: 'Dấu Chân, về đầu trang',
    homeLinkDetail: 'Dấu Chân, về trang chủ',
    closeMenu: 'Đóng menu',
    openMenu: 'Mở menu',
    mainNavigation: 'Điều hướng chính',
    contents: 'Mục lục',
    heroEyebrow: 'NHỮNG NƠI MÌNH ĐÃ ĐI QUA',
    heroTitleStart: 'Mình đã',
    heroTitleEnd: 'cùng nhau.',
    heroDescription: 'Một cuốn album mở, gom ảnh, thước phim và những ngày chẳng muốn quên.',
    heroImage: 'Ảnh từ một chuyến đi',
    heroImageAlt: 'Cả nhóm chụp ảnh cùng nhau tại Ninh Bình',
    browseAlbum: 'Lật xem album',
    overview: 'Tổng quan album',
    placesCount: 'địa điểm',
    tripsCount: 'chuyến đi',
    memoriesCount: 'kỷ niệm',
    albumEyebrow: 'ALBUM CỦA CHÚNG MÌNH',
    albumTitleStart: 'Mỗi chuyến đi',
    albumTitleEnd: 'chương riêng.',
    albumDescription: 'Mở lại từng chuyến, xem nơi mình đã đến và những khoảnh khắc còn nằm trong máy ảnh.',
    placeLabel: 'Địa điểm',
    allPlaces: 'Tất cả địa điểm',
    yearLabel: 'Năm',
    allYears: 'Tất cả năm',
    tripCountSuffix: 'chuyến đi',
    emptyTitle: 'Chưa có trang album ở đây',
    emptyDescription: 'Thử chọn địa điểm hoặc năm khác để xem thêm chuyến đi.',
    placesTitleStart: 'Bản đồ nhỏ',
    placesTitleEnd: 'chúng mình.',
    visitsSuffix: 'lần ghé',
    visitsCount: (count: number) => `${count} lần ghé`,
    mapAria: 'Bản đồ những nơi chúng mình đã ghé thăm',
    mapHeading: 'NHỮNG NƠI ĐÃ ĐI QUA',
    mapCountSuffix: 'địa điểm trên bản đồ',
    mapPlacesCount: (count: number) => `${count} địa điểm trên bản đồ`,
    visitedPlaces: 'địa điểm đã ghé thăm',
    visitedPlacesCount: (count: number) => `${count} địa điểm đã ghé thăm`,
    mapHint: 'Chạm vào điểm để xem album',
    mapInteractive: 'Bản đồ tương tác các địa điểm đã ghé thăm',
    zoomIn: 'Phóng to bản đồ',
    zoomOut: 'Thu nhỏ bản đồ',
    momentsTitleStart: 'Những khoảnh khắc',
    momentsTitleMiddle: 'đáng nhớ',
    momentsTitleEnd: 'nhất.',
    momentsDescription: 'Có những tấm ảnh chỉ cần nhìn một lần là nhớ cả ngày hôm ấy.',
    momentControls: 'Điều khiển album khoảnh khắc',
    previousMoment: 'Khoảnh khắc trước',
    nextMoment: 'Khoảnh khắc tiếp theo',
    momentSlider: 'Slider khoảnh khắc',
    viewPhotoAt: (place: string) => `Xem ảnh tại ${place}`,
    selectMoment: 'Chọn khoảnh khắc',
    goToMoment: (index: number, place: string) => `Đi đến khoảnh khắc ${index}: ${place}`,
    groupByLake: 'Cả nhóm bên hồ và núi đá ở Ninh Bình',
    groupInMist: 'Cả nhóm trong sương ở Sa Pa',
    groupByBay: 'Cả nhóm bên vịnh Hạ Long',
    groupHeart: 'Cả nhóm cùng tạo hình trái tim ở Ninh Bình',
    lightbox: 'Xem ảnh toàn màn hình',
    closePhoto: 'Đóng ảnh',
    previousPhoto: 'Ảnh trước',
    nextPhoto: 'Ảnh tiếp theo',
    openTrip: (title: string, place: string) => `Mở chi tiết ${title} tại ${place}`,
    photoCount: 'ảnh',
    videoCount: 'video',
    mediaCount: (photos: number, videos: number) => `${photos} ảnh${videos > 0 ? ` · ${videos} video` : ''}`,
    mapTripCount: (count: number) => `${count} ${count === 1 ? 'chuyến' : 'chuyến đi'}`,
    photoFromTrip: (place: string, date: string) => `Ảnh từ chuyến đi ${place} ngày ${date}.`,
    imageNumber: (index: number, place: string) => `Ảnh ${index} trong chuyến đi ${place}`,
    footerLine: 'Đi qua rồi, vẫn còn ở đây.',
    allTrips: 'Tất cả chuyến đi',
    backToTop: 'Về đầu trang',
    notFoundEyebrow: '404 · KHÔNG TÌM THẤY TRANG',
    notFoundTitle: 'Trang này chưa có ở đây.',
    homeButton: 'Về trang chủ',
    missingTrip: 'KHÔNG TÌM THẤY CHUYẾN ĐI',
    missingAlbum: 'Album này chưa có ở đây.',
    backToAlbum: 'Quay lại album',
    breadcrumb: 'Đường dẫn',
    tripFacts: 'Thông tin chuyến đi',
    duration: 'Thời gian',
    inAlbum: 'Trong album',
    albumPhotos: 'ALBUM ẢNH',
    daysIn: (place: string) => `Những ngày ở ${place}.`,
    photoCountText: (count: number) => `${count} tấm ảnh`,
    openPhoto: (index: number, place: string) => `Mở ảnh ${index} trong album ${place}`,
    photoAlt: (place: string, index: number) => `${place}, ảnh ${index}`,
    fromTrips: 'A photo from our trip',
  },
  en: {
    documentTitle: 'Footprints | Our travel album',
    brandSubtitle: 'OUR TRAVEL ALBUM',
    switchLanguage: 'Chuyển sang tiếng Việt',
    skipNavigation: 'Skip navigation',
    quickNavigation: 'Quick navigation',
    home: 'Home',
    album: 'Album',
    map: 'Places map',
    moments: 'Moments',
    homeLink: 'Footprints, back to top',
    homeLinkDetail: 'Footprints, go to homepage',
    closeMenu: 'Close menu',
    openMenu: 'Open menu',
    mainNavigation: 'Main navigation',
    contents: 'Contents',
    heroEyebrow: 'PLACES WE HAVE BEEN',
    heroTitleStart: 'We went',
    heroTitleEnd: 'together.',
    heroDescription: 'An open album of photos, little films, and days we never want to forget.',
    heroImage: 'A photo from one of our trips',
    heroImageAlt: 'Our group taking a photo together in Ninh Binh',
    browseAlbum: 'Explore the album',
    overview: 'Album overview',
    placesCount: 'places',
    tripsCount: 'trips',
    memoriesCount: 'memories',
    albumEyebrow: 'OUR TRAVEL ALBUM',
    albumTitleStart: 'Every trip,',
    albumTitleEnd: 'its own chapter.',
    albumDescription: 'Revisit each trip, the places we have been, and the moments still tucked away in our camera roll.',
    placeLabel: 'Place',
    allPlaces: 'All places',
    yearLabel: 'Year',
    allYears: 'All years',
    tripCountSuffix: 'trips',
    emptyTitle: 'No album pages here yet',
    emptyDescription: 'Choose another place or year to find more trips.',
    placesTitleStart: 'A little map',
    placesTitleEnd: 'of our travels.',
    visitsSuffix: 'visits',
    visitsCount: (count: number) => `${count} ${count === 1 ? 'visit' : 'visits'}`,
    mapAria: 'Map of the places we have visited',
    mapHeading: 'PLACES WE HAVE BEEN',
    mapCountSuffix: 'places on the map',
    mapPlacesCount: (count: number) => `${count} ${count === 1 ? 'place' : 'places'} on the map`,
    visitedPlaces: 'places visited',
    visitedPlacesCount: (count: number) => `${count} ${count === 1 ? 'place' : 'places'} visited`,
    mapHint: 'Select a marker to view its album',
    mapInteractive: 'Interactive map of places we have visited',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    momentsTitleStart: 'The moments',
    momentsTitleMiddle: 'we remember',
    momentsTitleEnd: 'most.',
    momentsDescription: 'Some photos bring the whole day back at a glance.',
    momentControls: 'Moment album controls',
    previousMoment: 'Previous moment',
    nextMoment: 'Next moment',
    momentSlider: 'Moment slider',
    viewPhotoAt: (place: string) => `View photos from ${place}`,
    selectMoment: 'Choose a moment',
    goToMoment: (index: number, place: string) => `Go to moment ${index}: ${place}`,
    groupByLake: 'Our group by the lake and limestone mountains in Ninh Binh',
    groupInMist: 'Our group in the mist in Sa Pa',
    groupByBay: 'Our group by Ha Long Bay',
    groupHeart: 'Our group making a heart shape in Ninh Binh',
    lightbox: 'View photo full screen',
    closePhoto: 'Close photo',
    previousPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    openTrip: (title: string, place: string) => `Open ${title} in ${place}`,
    photoCount: 'photos',
    videoCount: 'videos',
    mediaCount: (photos: number, videos: number) => `${photos} photos${videos > 0 ? ` · ${videos} videos` : ''}`,
    mapTripCount: (count: number) => `${count} ${count === 1 ? 'trip' : 'trips'}`,
    photoFromTrip: (place: string, date: string) => `Photos from our trip to ${place} on ${date}.`,
    imageNumber: (index: number, place: string) => `Photo ${index} from our trip to ${place}`,
    footerLine: 'We have moved on, but the memories stay.',
    allTrips: 'All trips',
    backToTop: 'Back to top',
    notFoundEyebrow: '404 · PAGE NOT FOUND',
    notFoundTitle: 'This page is not here yet.',
    homeButton: 'Go to homepage',
    missingTrip: 'TRIP NOT FOUND',
    missingAlbum: 'This album is not here yet.',
    backToAlbum: 'Back to the album',
    breadcrumb: 'Breadcrumb',
    tripFacts: 'Trip details',
    duration: 'Date',
    inAlbum: 'In this album',
    albumPhotos: 'PHOTO ALBUM',
    daysIn: (place: string) => `Days in ${place}.`,
    photoCountText: (count: number) => `${count} photos`,
    openPhoto: (index: number, place: string) => `Open photo ${index} in the ${place} album`,
    photoAlt: (place: string, index: number) => `${place}, photo ${index}`,
    fromTrips: 'A photo from our trip',
  },
} as const

type Translation = {
  [Key in keyof typeof copy.vi]: typeof copy.vi[Key] extends (...args: infer Args) => infer Result
    ? (...args: Args) => Result
    : string
}
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: Translation }

const LanguageContext = createContext<LanguageContextValue | null>(null)
const storageKey = 'footprints-language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return window.localStorage.getItem(storageKey) === 'en' ? 'en' : 'vi'
    } catch {
      return 'vi'
    }
  })

  useEffect(() => {
    document.documentElement.lang = language
    document.title = copy[language].documentTitle
    try {
      window.localStorage.setItem(storageKey, language)
    } catch {
      // Keep the language switch usable when browser storage is unavailable.
    }
  }, [language])

  const value = useMemo<LanguageContextValue>(() => ({ language, setLanguage, t: copy[language] }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider')
  return value
}

const placeNames: Record<string, string> = {
  'Ninh Bình': 'Ninh Binh',
  'Hạ Long': 'Ha Long',
}

const regionNames: Record<string, string> = {
  'Ninh Bình': 'Ninh Binh',
  'Lào Cai': 'Lao Cai',
  'Quảng Ninh': 'Quang Ninh',
}

export function localizedPlace(name: string, language: Language) {
  return language === 'en' ? placeNames[name] ?? name : name
}

export function localizedRegion(name: string, language: Language) {
  return language === 'en' ? regionNames[name] ?? name : name
}

export function formattedTripDate(id: string, language: Language, fallback = '') {
  if (language === 'vi') return fallback
  const match = id.match(/-(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return fallback
  const [, year, month, day] = match
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))))
}

export function formattedMonthYear(value: string, language: Language) {
  if (language === 'vi') return value
  const match = value.match(/(\d{2}),\s*(\d{4})/)
  if (!match) return value
  const [, month, year] = match
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(Number(year), Number(month) - 1, 1))).toUpperCase()
}

export function localizedTripTitle(place: string, language: Language) {
  return language === 'en' ? `A day in ${localizedPlace(place, language)}` : `Một ngày ở ${place}`
}

export function localizedMomentAlt(alt: string, language: Language) {
  if (language === 'vi') return alt
  const known: Record<string, string> = {
    'Cả nhóm bên hồ và núi đá ở Ninh Bình': copy.en.groupByLake,
    'Cả nhóm trong sương ở Sa Pa': copy.en.groupInMist,
    'Cả nhóm bên vịnh Hạ Long': copy.en.groupByBay,
    'Cả nhóm cùng tạo hình trái tim ở Ninh Bình': copy.en.groupHeart,
  }
  return known[alt] ?? alt
}

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()
  const nextLanguage = language === 'vi' ? 'en' : 'vi'

  return (
    <button
      className="language-toggle"
      type="button"
      onClick={() => setLanguage(nextLanguage)}
      aria-label={t.switchLanguage}
      title={t.switchLanguage}
    >
      {nextLanguage.toUpperCase()}
    </button>
  )
}
