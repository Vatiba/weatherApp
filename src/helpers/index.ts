import AsyncStorage from '@react-native-async-storage/async-storage';

const getCelsiusFromKelvin = (temp: number) => {
   return (temp - 273.15).toFixed();
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
}