const axios = require('axios').default;

const KEY_API = `31678159-88f5618da94fdea3c5da1a6bf`;
const BASE_URL = `https://pixabay.com/api/`;

export default async function fetchImage(valueInput, pageNow) {
  const response = await axios.get(
    `${BASE_URL}?key=${KEY_API}&q=${valueInput}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNow}`
  );

  return response;
}
