import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesApiService {
  constructor() {
    this.searchText = '';
    this.page = 1;
  }

  async getSearch() {
    const params = {
      key: '38612170-77e451be80bcbbe7a33b7fee0',
      q: this.searchText,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
    };

    try {
      const response = await axios.get(BASE_URL, { params });
      return response.data; // Отримуємо масив зображень з відповіді
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  get text() {
    return this.searchText;
  }

  set text(newSearchText) {
    this.searchText = newSearchText;
  }
}
