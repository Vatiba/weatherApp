type CityWeatherType = {
   coord: {
      lon: number
      lat: number
   }
   weather: {
      id: number
      main: string
      description: string
      icon: string
   }[]
   base: string
   main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      pressure: number
      humidity: number
   }
   visibility: number
   wind: {
      speed: number
      deg: number
   }
   clouds: {
      all: number
   }
   dt: number
   sys: {
      type: number
      id: number
      country: string
      sunrise: number
      sunset: number
   }
   timezone: number
   id: number
   name: string
   cod: number
}

type CityWeatherHourlyType = {
   cod: number
   message: number
   cnt: number
   list: {
      dt: number
      main: {
         temp: number
         feels_like: number
         temp_min: number
         temp_max: number
         pressure: number
         sea_level: number
         grnd_level: number
         humidity: number
         temp_kf: number
      }
      weather: {
         id: number
         main: string
         description: string
         icon: string
      }[]
      clouds: {
         all: number
      }
      wind: {
         speed: number
         deg: number
         gust: number
      }
      visibility: number
      pop: number
      sys: {
         pod: number
      }
      dt_txt: string
   }[]
   city: {
      id: number
      name: string
      coord: {
         lat: number
         lon: number
      }
      country: string
      population: number
      timezone: number
      sunrise: number
      sunset: number
   }
}

type LocationsType = {
   data: {
      id: number
      wikiDataId: string
      type: string
      city: string
      name: string
      country: string
      countryCode: string
      region: string
      regionCode: string
      regionWdId: string
      latitude: number
      longitude: number
      population: number
   }[]
}

type DailyWeather = {
   [key: string]: {
      averageTemp: number;
      mostCommonIcon: string;
      iconCounts: {
         [key: string]: number;
      };
   };
}

export type {
   CityWeatherType,
   LocationsType,
   CityWeatherHourlyType,
   DailyWeather
}