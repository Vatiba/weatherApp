import AsyncStorage from '@react-native-async-storage/async-storage';
import { CityWeatherHourlyType, DailyWeather } from '../types';

const getCelsiusFromKelvin = (temp: number) => {
   return (Number(temp) - 273.15).toFixed();
}

const getFormattedTime = (time: number) => {
   let unix_timestamp = time;

   // Create a new JavaScript Date object based on the timestamp
   // multiplied by 1000 so that the argument is in milliseconds, not seconds
   var date = new Date(unix_timestamp * 1000);

   // Hours part from the timestamp
   var hours = date.getHours();

   // Minutes part from the timestamp
   var minutes = "0" + date.getMinutes();

   // Seconds part from the timestamp
   // var seconds = "0" + date.getSeconds();

   // Will display time in 10:30:23 format
   var formattedTime = hours + ':' + minutes.substr(-2);
   // + ':' + seconds.substr(-2);

   return formattedTime;
}

const storeData = async (key: string, value: any) => {
   try {
      await AsyncStorage.setItem(key, value);
   } catch (error) {
      console.log('Error storing value: ', error);
   }
};

const getAveragefromEachDate = (weatherData: CityWeatherHourlyType['list']): DailyWeather => {

   // Create an object to store average temperatures and icons for each date
   const averageData: { [key: string]: { averageTemp: number; mostCommonIcon: string; iconCounts: { [key: string]: number } } } = {};

   // Iterate through each entry in weatherData
   weatherData.forEach(entry => {
      // Extract date from dt_txt property (assuming it's always in the format "YYYY-MM-DD")
      const date = entry.dt_txt.split(' ')[0];

      // If the date is not already in the averageData object, initialize it
      if (!averageData[date]) {
         averageData[date] = {
            averageTemp: 0,
            mostCommonIcon: '',
            iconCounts: {},
         };
      }

      // Convert temperature from Kelvin to Celsius
      const tempCelsius = entry.main.temp - 273.15;

      // Add the temperature to the sum
      averageData[date].averageTemp += tempCelsius;

      // Update the icon count
      const icon = entry.weather[0].icon;
      averageData[date].mostCommonIcon = averageData[date].mostCommonIcon || icon;

      // Check if the current icon occurred more frequently
      if (averageData[date].mostCommonIcon !== icon) {
         averageData[date].mostCommonIcon =
            averageData[date].mostCommonIcon &&
               averageData[date].mostCommonIcon in averageData[date].iconCounts &&
               averageData[date].iconCounts[averageData[date].mostCommonIcon] > averageData[date].iconCounts[icon]
               ? averageData[date].mostCommonIcon
               : icon;
      }

      // Update the icon count
      averageData[date].iconCounts[icon] = (averageData[date].iconCounts[icon] || 0) + 1;
   });

   // Calculate the average temperature and most common icon for each date
   for (const date in averageData) {
      averageData[date].averageTemp /= Object.keys(averageData[date].iconCounts).length;

      averageData[date] = {
         averageTemp: parseFloat(averageData[date].averageTemp.toFixed(2)), // Round to 2 decimal places
         mostCommonIcon: averageData[date].mostCommonIcon,
         iconCounts: averageData[date].iconCounts,
      };
   }
   return averageData;
}

const getData = async (key: string) => {
   try {
      const value = await AsyncStorage.getItem(key);
      return value;
   } catch (error) {
      console.log('Error retrieving value: ', error);
   }
};

export {
   getCelsiusFromKelvin,
   getFormattedTime,
   storeData,
   getData,
   getAveragefromEachDate
}