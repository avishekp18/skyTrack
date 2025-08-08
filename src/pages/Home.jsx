// src/pages/Home.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { Inputs, TemperatureAndDetails, SunriseAndSunset, Forecast, TopButtons } from '../components';
import { WEATHER_API_URL, WEATHER_API_KEY } from '../components/Api';

const Home = () => {
	const [currentWeather, setCurrentWeather] = useState(null);
	const [forecast, setForecast] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState('current'); // 'current' or 'forecast'
	const [currentLocation, setCurrentLocation] = useState({ lat: null, lon: null }); // Store current geolocation

	const handleOnSearchChange = useCallback(async (searchData) => {
		setIsLoading(true);
		setError(null);

		try {
			const [lat, lon] = searchData.value.split(' ');

			const [weatherRes, forecastRes] = await Promise.all([
				fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`).then(res => res.json()),
				fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`).then(res => res.json()),
			]);

			if (weatherRes.cod !== 200 || forecastRes.cod !== '200') {
				throw new Error(weatherRes.message || forecastRes.message || 'Failed to fetch weather data');
			}

			const cityName = weatherRes.name || searchData.label; // Use API name or fallback to label
			setCurrentWeather({ city: cityName, ...weatherRes });
			setForecast({ city: cityName, ...forecastRes });
		} catch (err) {
			setError(err.message || 'Failed to fetch weather data');
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Fetch weather by geolocation and update current location
	const fetchWeatherByLocation = useCallback(() => {
		if (navigator.geolocation) {
			setIsLoading(true);
			setError(null);

			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;
					setCurrentLocation({ lat: latitude, lon: longitude }); // Update current location state

					try {
						const [weatherRes, forecastRes] = await Promise.all([
							fetch(`${WEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`).then(res => res.json()),
							fetch(`${WEATHER_API_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`).then(res => res.json()),
						]);

						if (weatherRes.cod !== 200 || forecastRes.cod !== '200') {
							throw new Error(weatherRes.message || forecastRes.message || 'Failed to fetch weather data');
						}

						const cityName = weatherRes.name || 'Current Location'; // Fallback to 'Current Location' if name is unavailable
						setCurrentWeather({ city: cityName, ...weatherRes });
						setForecast({ city: cityName, ...forecastRes });
					} catch (err) {
						setError(err.message || 'Unable to fetch location-based weather');
					} finally {
						setIsLoading(false);
					}
				},
				(err) => {
					setError('Geolocation access denied. Please search manually.');
					setIsLoading(false);
				}
			);
		} else {
			setError('Geolocation is not supported by this browser.');
			setIsLoading(false);
		}
	}, []);

	// Load weather by location on mount
	useEffect(() => {
		fetchWeatherByLocation();
	}, [fetchWeatherByLocation]);

	// Determine background class based on weather condition
	const getBackgroundClass = () => {
		if (!currentWeather || !currentWeather.weather) return 'bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80';
		const condition = currentWeather.weather[0].main.toLowerCase();
		switch (condition) {
			case 'clear':
				return 'bg-gradient-to-br from-[#0f2027]/80 via-[#203a43]/60 to-[#2c5364]/80'; // Deep blue sky tones
			case 'clouds':
				return 'bg-gradient-to-br from-gray-800/80 via-gray-600/60 to-gray-900/80'; // Soft stormy grays
			case 'rain':
			case 'drizzle':
				return 'bg-gradient-to-br from-[#2c3e50]/80 via-[#4ca1af]/50 to-[#2c3e50]/80'; // Cool rainy bluish tones
			case 'snow':
				return 'bg-gradient-to-br from-[#e0eafc]/70 via-[#cfdef3]/60 to-[#e0eafc]/70'; // Icy blues and whites
			case 'thunderstorm':
				return 'bg-gradient-to-br from-[#1f1c2c]/90 via-[#928dab]/60 to-[#1f1c2c]/90'; // Dark purple storm theme
			case 'mist':
			case 'fog':
				return 'bg-gradient-to-br from-[#3e5151]/80 via-[#decba4]/50 to-[#3e5151]/80'; // Earthy foggy tones
			default:
				return 'bg-gradient-to-br from-gray-900/80 via-gray-700/60 to-gray-900/80'; // Fallback dark neutral
		}

	};

	return (
		<div
			className={`min-h-screen ${getBackgroundClass()} flex flex-col items-center justify-center p-4 sm:p-6 font-SecondaSoft relative overflow-hidden`}
		>
			{/* Animated Background Overlay with Enhanced Glassmorphism */}
			<div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-gray-800/20 to-gray-900/30 backdrop-blur-lg animate-[weatherShift_15s_ease-in-out_infinite] opacity-80 z-0" />
			{/* Top Buttons for City Selection */}
			<div className="flex justify-center mb-6 z-20">
				<TopButtons
					onSearchChange={handleOnSearchChange}
					currentLocation={currentLocation}
				/>
			</div>
			<div className="w-full max-w-6xl space-y-8 animate-[fadeIn_0.8s_ease-out] z-10 relative">
				{/* Header with Search and Tabs */}
				<div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 mt-40 sm:mt-24 shadow-2xl sidebar relative z-30 border border-gray-700/40">
					{/* App Title */}
					<h1 className="text-2xl sm:text-3xl font-semibold text-white text-center mb-6 animate-[slideDown_0.5s_ease-out]">
						Weather Insight
					</h1>

					{/* Tab Navigation */}
					<div className="flex justify-center mt-8 mb-6 space-x-4">
						<button
							className={`px-4 py-2 rounded-lg transition-colors duration-300 ${activeTab === 'current' ? 'bg-gray-700/70 text-white' : 'bg-gray-600/50 text-gray-300 hover:bg-gray-700/70 hover:text-white'} backdrop-blur-md`}
							onClick={() => setActiveTab('current')}
						>
							Current Weather
						</button>
						<button
							className={`px-4 py-2 rounded-lg transition-colors duration-300 ${activeTab === 'forecast' ? 'bg-gray-700/70 text-white' : 'bg-gray-600/50 text-gray-300 hover:bg-gray-700/70 hover:text-white'} backdrop-blur-md`}
							onClick={() => setActiveTab('forecast')}
						>
							7-Day Forecast
						</button>
					</div>

					{/* Search Input */}
					<div className="mb-6">
						<Inputs onSearchChange={handleOnSearchChange} isLoading={isLoading} />
					</div>

					{/* Error Message */}
					{error && (
						<p className="mt-4 text-sm text-red-200 bg-red-800/60 rounded-lg p-2 text-center animate-[fadeIn_0.5s_ease-out] backdrop-blur-md">
							{error}
						</p>
					)}

					{/* Loading Spinner */}
					{isLoading && (
						<div className="mt-4 flex justify-center">
							<div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full" />
						</div>
					)}

					{/* Last Updated Timestamp */}
					{currentWeather && !isLoading && !error && (
						<p className="mt-4 text-sm bg-white/10 text-gray-300   border-none rounded-lg px-4 py-2 text-center animate-[fadeIn_0.7s_ease-out] backdrop-blur-md">
							Last updated: {new Date().toLocaleTimeString()}
						</p>
					)}
				</div>

				{/* Main Weather Content */}
				{currentWeather && !isLoading && !error && activeTab === 'current' && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[slideUp_0.6s_ease-out]">
						{/* Current Weather */}
						<div className="weather_box bg-gray-800/60 backdrop-blur-xl rounded-2xl p-2 mb-8 sm:p-8 shadow-2xl border border-gray-700/40">
							<TemperatureAndDetails data={currentWeather} />
						</div>

						{/* Sunrise & Sunset */}

						<SunriseAndSunset data={currentWeather} />
					</div>

				)}

				{/* Forecast */}
				{forecast && !isLoading && !error && activeTab === 'forecast' && (
					<div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-700/40 sidebarr animate-[slideUp_0.6s_ease-out]">
						<Forecast title="7-Day Forecast" data={forecast} />
					</div>
				)}

				{/* No Data Message */}
				{!currentWeather && !isLoading && !error && (
					<div className="text-center p-6 bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/40 animate-[fadeIn_0.8s_ease-out]">
						<p className="text-lg text-gray-300 font-medium">
							Search for a city or allow location access to view weather details.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;