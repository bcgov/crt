import * as api from '../../Api';

import { FETCH_REGIONS } from './types';

export const fetchRegions = () => (dispatch) => {
  return api.getRegions().then((response) => {
    const data = response.data;
    dispatch({ type: FETCH_REGIONS, payload: data });
  });
};