export interface Album {
  id: number
  artist: string
  title: string
  cover?: string
  year: string | number
  score: string
  spotifyUrl: string
}

export interface SpotifyAlbum {
  id: string
  images: Array<{ url: string }>
  name: string
  artists: Array<{ name: string }>
  release_date: string
  external_urls: {
    spotify: string
  }
}

