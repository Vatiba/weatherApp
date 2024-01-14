import axios from 'axios';
import { appid } from '../constants';
import { CityWeatherHourlyType, CityWeatherType, LocationsType } from '../types';

const apiEndPoint = (parameter: {
   cityName: string
   appid: string
}) => {
   return `https://api.openweathermap.org/data/2.5/weather?q=${parameter.cityName}&appid=${parameter.appid}`
}

const apiEndPointHourly = (parameter: {
   lon: number,
   lat: number,
   appid: string
}) => {
   return `https://api.openweathermap.org/data/2.5/forecast?lat=${parameter.lat}&lon=${parameter.lon}&appid=${parameter.appid}`
}

const searchApiEndPoint = (parameter: {
   search: string
   limit: number
}) => {
   return `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${parameter.search}&limit=${parameter.limit}`
}

const getLocations = async (search: string) => {
   return axios.get<LocationsType>(searchApiEndPoint({
      search,
      limit: 5
   }), {
      headers: {
         'X-RapidAPI-Key': '87ca0e4b15msh47bbe3a11085f67p1d88a1jsnb00a1ce9fec4',
         'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
   })
}

const getWeather = async (cityName: string) => {
   return axios.get<CityWeatherType>(apiEndPoint({
      appid: appid,
      cityName: cityName
   }))
}

const getWeatherHourly = async (lon: number, lat: number) => {
   return axios.get<CityWeatherHourlyType>(apiEndPointHourly({
      appid: appid,
      lon,
      lat,
   }))
}

export {
   getWeather,
   getLocations,
   getWeatherHourly
};