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

export type {
   CityWeatherType,
   LocationsType
}