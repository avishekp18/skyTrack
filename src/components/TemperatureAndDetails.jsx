import React from "react";
import { GoLocation } from "react-icons/go";
import { temp, wind, humid } from "../assets/images";

const TemperatureAndDetails = ({ data }) => {
	// Function to get current date and time in IST
	const getCurrentDateTime = () => {
		const now = new Date();
		const options = {
			weekday: "short",
			day: "2-digit",
			month: "short",
			year: "numeric",
			timeZone: "Asia/Kolkata",
		};
		return now.toLocaleString("en-US", options).replace(",", "") + " IST";
	};

	// Weather icon URL with fallback
	const weatherIcon = data.weather && data.weather[0]?.icon;
	const iconUrl = weatherIcon
		? `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`
		: "http://openweathermap.org/img/wn/01d@2x.png";

	return (
		<div
			className="
				w-full max-w-md mx-auto
				bg-white/10 
				backdrop-blur-2xl 
				border border-white/30
				shadow-lg 
				rounded-xl 
				p-6
				text-white 
				font-sans
				backdrop-saturate-150
				hover:bg-white/20
				transition
				duration-500
				ease-in-out
			"
			style={{
				boxShadow:
					"0 8px 32px 0 rgba(38, 39, 44, 0.37)",
				WebkitBackdropFilter: "blur(15px)",
				backdropFilter: "blur(15px)",
			}}
		>
			{/* Header: Location and Date */}
			<div className="flex justify-between items-center mb-5">
				<div className="flex items-center space-x-2">
					<GoLocation size={18} className="text-gray-200" />
					<p className="text-lg font-semibold truncate max-w-[150px]">
						{data.city || "Loading..."}
					</p>
				</div>
				<p className="text-xs text-gray-300">{getCurrentDateTime()}</p>
			</div>

			{/* Main Weather Info */}
			<div className="flex items-center justify-between gap-6">
				{/* Weather Icon */}
				<img
					src={iconUrl}
					alt={data.weather[0]?.description || "weather icon"}
					className="h-24 w-24 object-contain"
					onError={(e) => {
						e.target.src = "http://openweathermap.org/img/wn/01d@2x.png";
					}}
				/>

				{/* Temperature and Description */}
				<div className="text-right">
					<div className="flex items-baseline gap-1">
						<p className="text-5xl font-extrabold leading-none">
							{Math.round(data.main?.temp) || "--"}
						</p>
						<span className="text-3xl font-light text-gray-300">°C</span>
					</div>
					<p className="text-sm text-gray-300 capitalize mt-1">
						{data.weather[0]?.description || "No description"}
					</p>
				</div>
			</div>

			{/* Additional Details */}
			<div className="grid grid-cols-3 gap-6 mt-6 bg-white/20 rounded-xl p-4 border border-white/30 shadow-inner">
				{/* Feels Like */}
				<div className="flex flex-col items-center">
					<img src={temp} alt="Temperature Feel" className="w-7 h-7 mb-2" />
					<p className="text-sm font-semibold">
						{Math.round(data.main?.feels_like) || "--"}°C
					</p>
					<p className="text-xs text-gray-300">Feels Like</p>
				</div>

				{/* Humidity */}
				<div className="flex flex-col items-center">
					<img src={humid} alt="Humidity" className="w-7 h-7 mb-2" />
					<p className="text-sm font-semibold">
						{data.main?.humidity || "--"}%
					</p>
					<p className="text-xs text-gray-300">Humidity</p>
				</div>

				{/* Wind Speed */}
				<div className="flex flex-col items-center">
					<img src={wind} alt="Wind Speed" className="w-7 h-7 mb-2" />
					<p className="text-sm font-semibold">
						{data.wind?.speed || "--"} km/h
					</p>
					<p className="text-xs text-gray-300">Wind Speed</p>
				</div>
			</div>
		</div>
	);
};

export default TemperatureAndDetails;
