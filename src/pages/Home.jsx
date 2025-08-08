// src/pages/Home.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { Inputs, TemperatureAndDetails, SunriseAndSunset, Forecast, TopButtons } from '../components';
import { WEATHER_API_URL, WEATHER_API_KEY } from '../components/Api';
import ErrorBoundary from '../components/ErrorBoundary'; // Reusing the ErrorBoundary from previous instructions

const Home = () => {
	const [currentWeather, setCurrentWeather] = useState(null);
	const [forecast, setForecast] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState('current'); // 'current' or 'forecast'
	const [currentLocation, setCurrentLocation] = useState({ lat: null, lon: null });
	const [showLocationModal, setShowLocationModal] = useState(false); // State for modal visibility

	// Fetch weather by coordinates helper
	const fetchWeatherByCoords = useCallback(async (lat, lon) => {
		setIsLoading(true);
		setError(null);

		try {
			const [weatherRes, forecastRes] = await Promise.all([
				fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`).then(res => res.json()),
				fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`).then(res => res.json()),
			]);

			if (weatherRes.cod !== 200 || forecastRes.cod !== '200') {
				throw new Error(weatherRes.message || forecastRes.message || 'Failed to fetch weather data');
			}

			const cityName = weatherRes.name || 'Current Location';
			setCurrentWeather({ city: cityName, ...weatherRes });
			setForecast({ city: cityName, ...forecastRes });
		} catch (err) {
			setError(err.message || 'Unable to fetch location-based weather');
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Fetch user's geolocation and update currentLocation state
	const fetchLocation = useCallback(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setCurrentLocation({
						lat: position.coords.latitude,
						lon: position.coords.longitude,
					});
					setShowLocationModal(false); // Close modal if geolocation succeeds
				},
				() => {
					setError('Geolocation access denied. Please search for a location manually.');
					setShowLocationModal(true); // Show modal on geolocation denial
				}
			);
		} else {
			setError('Geolocation is not supported by this browser.');
			setShowLocationModal(true); // Show modal if geolocation is unsupported
		}
	}, []);

	// Trigger fetching location once on mount
	useEffect(() => {
		fetchLocation();
	}, [fetchLocation]);

	// When currentLocation updates and is valid, fetch weather data
	useEffect(() => {
		if (currentLocation.lat && currentLocation.lon) {
			fetchWeatherByCoords(currentLocation.lat, currentLocation.lon);
		}
	}, [currentLocation, fetchWeatherByCoords]);

	// Handle search changes from the search input (city/location search)
	const handleOnSearchChange = useCallback(async (searchData) => {
		setIsLoading(true);
		setError(null);
		setShowLocationModal(false); // Close modal when user searches manually

		try {
			const [lat, lon] = searchData.value.split(' ');

			const [weatherRes, forecastRes] = await Promise.all([
				fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`).then(res => res.json()),
				fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`).then(res => res.json()),
			]);

			if (weatherRes.cod !== 200 || forecastRes.cod !== '200') {
				throw new Error(weatherRes.message || forecastRes.message || 'Failed to fetch weather data');
			}

			const cityName = weatherRes.name || searchData.label;
			setCurrentWeather({ city: cityName, ...weatherRes });
			setForecast({ city: cityName, ...forecastRes });
			setCurrentLocation({ lat, lon });
		} catch (err) {
			setError(err.message || 'Failed to fetch weather data');
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Background SVG component (Black Universe Background)
	const BlackUniverseBackground = () => (
		<svg
			className="absolute inset-0 w-full h-full z-[-1]"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="xMidYMid slice"
			viewBox="0 0 800 600"
		>
			<defs>
				<radialGradient id="bgGradient" cx="50%" cy="50%" r="70%">
					<stop offset="0%" stopColor="#f9f9f9ff" />
					<stop offset="100%" stopColor="#8d8d8eff" />
				</radialGradient>
				<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
					<feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#fff" floodOpacity="0.7" />
				</filter>
			</defs>
			<rect width="800" height="600" fill="url(#bgGradient)" />
			{[...Array(60)].map((_, i) => (
				<circle
					key={i}
					cx={Math.random() * 800}
					cy={Math.random() * 600}
					r={Math.random() * 1.3 + 0.2}
					fill="white"
					opacity={Math.random() * 0.9 + 0.1}
					filter="url(#glow)"
				/>
			))}
			{[...Array(8)].map((_, i) => {
				const cx = Math.random() * 800;
				const cy = Math.random() * 600;
				return (
					<circle
						key={'big-' + i}
						cx={cx}
						cy={cy}
						r={Math.random() * 2 + 1.5}
						fill="white"
						opacity={0.8}
						filter="url(#glow)"
						style={{
							animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
							transformOrigin: `${cx}px ${cy}px`,
						}}
					/>
				);
			})}
			<style>{`
        @keyframes twinkle {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
		</svg>
	);

	// Location Denied Modal
	const LocationDeniedModal = () => (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-out]">
			<div className="bg-gray-800/60 backdrop-blur-2xl rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-[90%] sm:max-w-md mx-auto border border-gray-700/40 shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
				<h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white text-center mb-4">
					Location Access Denied
				</h2>
				<p className="text-sm sm:text-base text-gray-300 text-center mb-6">
					We couldn’t access your location. Please search for a city manually to view weather details.
				</p>
				<div className="flex justify-center">
					<button
						onClick={() => setShowLocationModal(false)}
						className="px-4 sm:px-6 py-2 rounded-lg bg-gray-700/70 text-white hover:bg-gray-600/70 transition-colors duration-300 backdrop-blur-md"
						aria-label="Close location denied modal"
					>
						OK
					</button>
				</div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-SecondaSoft relative overflow-hidden">
			{/* Background */}
			<BlackUniverseBackground />

			{/* Animated Background Overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-gray-800/20 to-gray-900/30 backdrop-blur-lg animate-[weatherShift_15s_ease-in-out_infinite] opacity-80 z-0" />

			{/* Location Denied Modal */}
			{showLocationModal && <LocationDeniedModal />}

			{/* Top Buttons */}
			<div className="flex justify-center mb-6 z-20">
				<TopButtons onSearchChange={handleOnSearchChange} currentLocation={currentLocation} />
			</div>

			<div className="w-full max-w-6xl space-y-8 animate-[fadeIn_0.8s_ease-out] z-10 relative">
				{/* Header */}
				<div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 mt-40 sm:mt-24 shadow-2xl sidebar relative z-30 border border-gray-700/40">
					<h1 className="text-2xl sm:text-3xl font-semibold text-white text-center mb-6 animate-[slideDown_0.5s_ease-out]">
						Weather Insight
					</h1>

					{/* Tabs */}
					<div className="flex justify-center mt-8 mb-6 space-x-4">
						<button
							className={`px-4 py-2 rounded-lg transition-colors duration-300 ${activeTab === 'current' ? 'bg-gray-700/70 text-white' : 'bg-gray-600/50 text-gray-300 hover:bg-gray-700/70 hover:text-white'
								} backdrop-blur-md`}
							onClick={() => setActiveTab('current')}
						>
							Current Weather
						</button>
						<button
							className={`px-4 py-2 rounded-lg transition-colors duration-300 ${activeTab === 'forecast' ? 'bg-gray-700/70 text-white' : 'bg-gray-600/50 text-gray-300 hover:bg-gray-700/70 hover:text-white'
								} backdrop-blur-md`}
							onClick={() => setActiveTab('forecast')}
						>
							7-Day Forecast
						</button>
					</div>

					{/* Search Input */}
					<div className="mb-6">
						<Inputs onSearchChange={handleOnSearchChange} isLoading={isLoading} />
					</div>

					{/* Error */}
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

					{/* Last Updated */}
					{currentWeather && !isLoading && !error && (
						<p className="mt-4 text-sm bg-white/10 text-gray-300 border-none rounded-lg px-4 py-2 text-center animate-[fadeIn_0.7s_ease-out] backdrop-blur-md">
							Last updated: {new Date().toLocaleTimeString()}
						</p>
					)}
				</div>

				{/* Current Weather */}
				{currentWeather && !isLoading && !error && activeTab === 'current' && (
					<div className="flex flex-wrap w-full gap-8 px-4 sm:px-8 animate-[slideUp_0.6s_ease-out]">
						<div className="flex flex-row w-full bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-600/50 flex-wrap">
							<div className="flex-1 min-w-[280px]">
								<ErrorBoundary>
									<TemperatureAndDetails data={currentWeather} />
								</ErrorBoundary>
							</div>
							<div className="flex-1 min-w-[280px] mt-6 sm:mt-0 sm:ml-8">
								<ErrorBoundary>
									<SunriseAndSunset data={currentWeather} />
								</ErrorBoundary>
							</div>
						</div>
					</div>
				)}

				{/* Forecast */}
				{forecast && !isLoading && !error && activeTab === 'forecast' && (
					<div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-700/40 animate-[slideUp_0.6s_ease-out]">
						<ErrorBoundary>
							<Forecast title="7-Day Forecast" data={forecast} />
						</ErrorBoundary>
					</div>
				)}

				{/* No data message */}
				{!currentWeather && !isLoading && !error && (
					<p className="text-center text-gray-400 mt-10 select-none">
						Search for a location to see weather details.
					</p>
				)}
			</div>
		</div>
	);
};

export default Home;