import { getData } from './request';

interface WeatherRes {
  cityid: string;
  city: string;
  cityEn: string;
  country: string;
  countryEn: string;
  update_time: string;
}

export const getWeather = () => {
  return getData<null, WeatherRes>(
    'https://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz'
  );
};
