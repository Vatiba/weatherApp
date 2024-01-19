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
	KeyboardAvoidingView,
	FlatList,
	ScrollView
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
import { getWeather, getLocations, getWeatherHourly } from '../services';
import { CityWeatherHourlyType, CityWeatherType, DailyWeather, LocationsType } from '../types';
import { getAveragefromEachDate, getCelsiusFromKelvin, getData, storeData } from '../helpers';
import { countryCodes, weatherImage, weatherImageBackground } from '../constants';
import dayjs from 'dayjs';


const HomeScreen = () => {
	const [locations, setLocations] = useState<LocationsType>();
	const [search, setSearch] = useState('');
	const [weather, setWeather] = useState<CityWeatherType>();
	const [hourlyWeather, setHourlyWeather] = useState<CityWeatherHourlyType['list']>();
	const [dailyWeather, setDailyWeather] = useState<DailyWeather>();
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
				getWeatherHourly(response.data.coord.lon, response.data.coord.lat).then(response => {
					setHourlyWeather(response.data.list);
					setDailyWeather(getAveragefromEachDate(response.data.list || []));
				}).finally(() => setLoading(false));
			}).finally(() => {
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
		console.log(myCity)
		if (myCity) cityName = myCity;
		getWeather(cityName).then(response => {
			setWeather(response.data);
			storeData('city', cityName);
			getWeatherHourly(response.data.coord.lon, response.data.coord.lat).then(response => {
				setHourlyWeather(response.data.list);
				setDailyWeather(getAveragefromEachDate(response.data.list || []));
			}).finally(() => setLoading(false));
		}).catch(error => {
			console.log(error);
			// if there is wrong name of city in storage it will change name of city and retry request
			cityName = 'Ashgabat';
			getWeather(cityName).then(response => {
				setWeather(response.data);
				storeData('city', cityName);
				getWeatherHourly(response.data.coord.lon, response.data.coord.lat).then(response => {
					setHourlyWeather(response.data.list);
					setDailyWeather(getAveragefromEachDate(response.data.list || []));
				}).finally(() => setLoading(false));
			})
		});
	}

	return (
		<View className='flex-1 relative'>
			<StatusBarExpo style='light' />
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
			>
				{
					weather ?
						<Image
							blurRadius={1}
							source={
								weatherImageBackground?.[weather.weather?.[0].icon] ||
								BgImage
							}
							className='absolute h-full w-full'
						/>
						:
						<Image
							blurRadius={70}
							source={BgImage}
							className='absolute h-full w-full'
						/>
				}
				{/* <SafeAreaView style={styles.AndroidSafeArea}> */}
				{
					!loading ?
						<>
							<View
								style={{ height: '7%', marginTop: 45, marginBottom: 20 }}
								className='mx-4 relative z-50'
							>
								<View
									style={{ backgroundColor: theme.bgWhite(0.2) }}
									className='flex-row justify-end items-center rounded-full'
								>
									<TextInput
										placeholder='Search city'
										placeholderTextColor='lightgray'
										className='pl-6 h-10 flex-1 text-base text-white'
										onChangeText={value => setSearch(value)}
										onSubmitEditing={() => handleSearch(search)}
									/>
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
											className='absolute w-full bg-gray-400 top-16 rounded-3xl'
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
									<View className='mx-4 flex justify-between flex-1 mb-10'>
										{/* location */}
										<Text
											className='text-white text-center text-2xl font-bold my-3'
										>
											{
												weather.name
											}
											<Text className='text-lg font-semibold text-gray-100'>
												{
													`, ${countryCodes?.[weather.sys.country]}` || ''
												}
											</Text>
										</Text>
										{/* weather image */}
										<View
											className='flex-row justify-center my-3'
										>
											<Image
												source={weatherImage[weather.weather?.[0].icon]}
												className='w-48 h-48'
											/>
										</View>
										{/* degree celcius */}
										<View
											className='space-y-2 my-3'
										>
											<Text className='text-center font-bold text-white text-6xl ml-5'>
												{getCelsiusFromKelvin(weather.main.temp)}&#176;
											</Text>
											<Text className='text-center text-white text-xl tracking-widest my-3'>
												{
													weather.weather?.[0].main
												}
											</Text>
										</View>
										<View className='flex-row justify-around mb-5'>
											<View className='flex-row items-center'>
												<Image
													source={WindImage}
													className='w-6 h-6 mr-2'
												/>
												<View className='flex-col'>
													<Text className='text-gray-100 text-sm'>Wind speed</Text>
													<Text className='text-white text-base'>{weather.wind.speed}m/s</Text>
												</View>
											</View>
											<View className='flex-row items-center'>
												<Image
													source={DropImage}
													className='w-6 h-6 mr-2'
												/>
												<View className='flex-col'>
													<Text className='text-gray-100 text-sm'>Humidity</Text>
													<Text className='text-white text-base'>{weather.main.humidity}%</Text>
												</View>
											</View>
										</View>

										<Text className='font-bold text-white text-lg tracking-widest my-3 mt-6'>
											Hourly
										</Text>
										<FlatList
											keyExtractor={(item, i) => item.dt_txt}
											data={hourlyWeather?.slice(0, 15)}
											renderItem={({ item }) => {
												return (
													<View
														style={{ backgroundColor: theme.bgWhite(0.2) }}
														className='flex-col items-center p-3 rounded-3xl mr-3 max-h-36 w-20'
													>
														<View
															className='flex-row justify-center mb-1'
														>
															<Image
																source={weatherImage[item.weather?.[0].icon]}
																className='w-14 h-14'
															/>
														</View>
														<Text className='text-gray-100 text-base'>
															{
																dayjs(item.dt_txt, 'YYYY-MM-DD HH:mm:ss').format('HH:mm') || ''
															}
														</Text>
														<Text className='text-white text-xl font-bold'>
															{getCelsiusFromKelvin(item.main.temp)}&#176;
														</Text>
													</View>
												)
											}}
											showsHorizontalScrollIndicator={false}
											horizontal={true}
										/>
										{
											dailyWeather ?
												<>
													<Text className='font-bold text-white text-lg tracking-widest my-3 mt-6'>
														Daily
													</Text>
													<FlatList
														keyExtractor={(item, i) => item.key}
														data={Object.keys(dailyWeather).map(key => ({
															key,
															...dailyWeather[key],
														}))}
														renderItem={({ item }) => {
															return (
																<View
																	style={{ backgroundColor: theme.bgWhite(0.2) }}
																	className='flex-col items-center p-3 rounded-3xl mr-3 max-h-36 w-20'
																>
																	<View
																		className='flex-row justify-center mb-1'
																	>
																		<Image
																			source={weatherImage[item.mostCommonIcon]}
																			className='w-14 h-14'
																		/>
																	</View>
																	<Text className='text-gray-100 text-base'>
																		{
																			dayjs(item.key, 'YYYY-MM-DD HH:mm:ss').format('ddd') || ''
																		}
																	</Text>
																	<Text className='text-white text-xl font-bold'>
																		{item.averageTemp.toFixed()}&#176;
																	</Text>
																</View>
															)
														}}
														showsHorizontalScrollIndicator={false}
														horizontal={true}
													/>
												</>
												:
												null
										}
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
			</ScrollView>
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