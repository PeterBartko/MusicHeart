export const getAccessToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${import.meta.env.VITE_APP_CLIENT_ID}:${import.meta.env.VITE_APP_CLIENT_SECRET}`)}`
    },
    body: 'grant_type=client_credentials'
  });
  
  const { access_token } = await response.json();
  return access_token;
}

export const fetchAlbums = async (query: string) => {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=10`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  const data = await response.json();
  return data.albums?.items;
}

export const getAlbumById = async (id: string) => {
  const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  return await response.json();
}
