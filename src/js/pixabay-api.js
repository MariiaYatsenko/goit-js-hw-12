import axios from 'axios';
const API_KEY = '50818292-28c953def5feac0614fc2706b';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page,
    per_page: 15,
  });

  const { data } = await axios.get(`${BASE_URL}?${params}`);
  return data;
}