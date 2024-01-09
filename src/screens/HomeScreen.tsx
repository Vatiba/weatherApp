import {
   View,
   Text,
   Image,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   Platform,
   StatusBar,
   SafeAreaView,
   KeyboardAvoidingView
} from 'react-native';
import { StatusBar as StatusBarExpo } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';

// images
import BgImage from '../assets/images/bg.png';
import WindImage from '../assets/icons/wind.png';
import DropImage from '../assets/icons/drop.png';
// import SunImage from '../assets/icons/sun.png';
// theme
import { theme } from '../theme';
// icons
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { getWeather, getLocations } from '../services';
import { CityWeatherType, LocationsType } from '../types';
import { getCelsiusFromKelvin, getData, storeData } from '../helpers';
import { weatherImage } from '../constants';


const HomeScreen = () => {
   const [locations, setLocations] = useState<LocationsType>();
   const [search, setSearch] = useState('');
   const [weather, setWeather] = useState<CityWeatherType>();
   const [loading, setLoading] = useState(true);
   const [toggleSearchbar, setToggleSearchbar] = useState(false);

   const handleLocation = (search: string) => {
      if (search.trim())
         getLocations(search).then((response) => {
            setLocations(response.data);
            storeData('city', search);
         }).finally(() => {
            setLoading(false)
         }).catch(error => {
            console.log(error);
         });
   }

   const handleSearch = async (cityName: string) => {
      console.log(cityName)
      if (cityName.trim())
         getWeather(cityName).then((response) => {
            setWeather(response.data);
            storeData('city', cityName);
         }).finally(() => {
            setLoading(false);
            setToggleSearchbar(false);
            setLocations(undefined);
         }).catch(error => {
            console.log(error);
         });
   }

   useEffect(() => {
      getMyWeatherData();
   }, []);

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         handleLocation(search);
      }, 700);
      return () => clearTimeout(timeoutId);
   }, [search]);

   const getMyWeatherData = async () => {
      let myCity = await getData('city');
      let cityName = 'Ashgabat';
      if (myCity) cityName = myCity;
      getWeather(cityName).then(response => {
         setWeather(response.data);
         storeData('city', cityName);
      }).finally(() => setLoading(false)).catch(error => {
         console.log(error);
      });
   }

   return (
      <View className='flex-1 relative'>
         <StatusBarExpo style='light' />
         <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 40}
            enabled={Platform.OS === "ios"}
            className='h-full'
         >
            <Image
               blurRadius={70}
               source={BgImage}
               className='absolute h-full w-full'
            />
            {/* <SafeAreaView style={styles.AndroidSafeArea}> */}
               {
                  !loading ?
                     <>
                        <View
                           style={{ height: '7%', marginTop: 45 }}
                           className='mx-4 relative z-50'
                        >
                           <View
                              style={{ backgroundColor: toggleSearchbar ? theme.bgWhite(0.2) : 'transparent' }}
                              className='flex-row justify-end items-center rounded-full'
                           >
                              {
                                 toggleSearchbar &&
                                 <TextInput
                                    placeholder='Search city'
                                    placeholderTextColor='lightgray'
                                    className='pl-6 h-10 flex-1 text-base text-white'
                                    onChangeText={value => setSearch(value)}
                                    onSubmitEditing={() => handleSearch(search)}
                                 />
                              }
                              <TouchableOpacity
                                 onPress={() => {
                                    setToggleSearchbar(prev => !prev);
                                    setLocations(undefined);
                                 }}
                                 style={{ backgroundColor: theme.bgWhite(0.3) }}
                                 className='rounded-full p-3 m-1'
                              >
                                 <MagnifyingGlassIcon size={25} color='white' />
                              </TouchableOpacity>
                           </View>
                           {
                              locations?.data?.length && toggleSearchbar ?
                                 <View
                                    className='absolute w-full bg-gray-300 top-16 rounded-3xl'
                                 >
                                    {
                                       locations.data.map((loc, index) => {
                                          const showBorder = index + 1 != locations?.data?.length;
                                          const borderClass = showBorder ? ' border-b-2 border-b-gray-400' : '';
                                          return (
                                             <TouchableOpacity
                                                key={index}
                                                onPress={() => handleSearch(loc.city)}
                                                className={'flex-row items-center border-0 p-3 px-4 mb-1' + borderClass}
                                             >
                                                <MapPinIcon size='20' color='gray' />
                                                <Text className='text-black text-lg ml-2' >
                                                   {loc.city}
                                                </Text>
                                             </TouchableOpacity>
                                          )
                                       })
                                    }
                                 </View>
                                 :
                                 null
                           }
                        </View>
                        {/* forecast section */}
                        {
                           weather ?
                              <View className='mx-4 flex justify-around flex-1 mb-10'>
                                 {/* location */}
                                 <Text
                                    className='text-white text-center text-2xl font-bold'
                                 >
                                    {
                                       weather.name
                                    }
                                    {/* <Text className='text-lg font-semibold text-gray-300'>
                                 United Kingdom
                              </Text> */}
                                 </Text>
                                 {/* weather image */}
                                 <View
                                    className='flex-row justify-center'
                                 >
                                    <Image
                                       source={weatherImage[weather.weather?.[0].icon]}
                                       className='w-52 h-52'
                                    />
                                 </View>
                                 {/* degree celcius */}
                                 <View
                                    className='space-y-2'
                                 >
                                    <Text className='text-center font-bold text-white text-6xl ml-5'>
                                       {getCelsiusFromKelvin(weather.main.temp)}&#176;
                                    </Text>
                                    <Text className='text-center text-white text-xl tracking-widest'>
                                       {
                                          weather.weather?.[0].main
                                       }
                                    </Text>
                                 </View>
                                 <View className='flex-row justify-around'>
                                    <View className='flex-row items-center'>
                                       <Image
                                          source={WindImage}
                                          className='w-4 h-5 mr-2'
                                       />
                                       <Text className='text-white text-lg'>{weather.wind.speed}m/s</Text>
                                    </View>
                                    <View className='flex-row items-center'>
                                       <Image
                                          source={DropImage}
                                          className='w-5 h-5 mr-2'
                                       />
                                       <Text className='text-white text-lg'>{weather.main.humidity}%</Text>
                                    </View>
                                 </View>
                              </View>
                              :
                              <View className='h-full flex-row items-center justify-center'>
                                 <Text className='text-white text-center text-2xl tracking-widest'>
                                    Type the city name to see the forecast
                                 </Text>
                              </View>
                        }
                     </>
                     :
                     <View className='h-full flex-row items-center justify-center'>
                        <Progress.CircleSnail size={140} thickness={10} color={['#0bb3b2']} />
                     </View>
               }
            {/* </SafeAreaView> */}
         </KeyboardAvoidingView>
      </View>
   )
}

export default HomeScreen


const styles = StyleSheet.create({
   AndroidSafeArea: {
      flex: 1,
      marginTop: (Platform.OS === "android" ? StatusBar.currentHeight : 0),
      paddingTop: 15
   }
});