// src/components/TemperatureAndDetails.jsx
import { GoLocation } from "react-icons/go";
import { temp, wind, humid } from "../assets/images";

const TemperatureAndDetails = ({ data }) => {
	// Get current date and time
	const getCurrentDateTime = () => {
		const now = new Date();
		const options = {
			weekday: "long",
			day: "2-digit",
			month: "long",
			year: "numeric",
			timeZone: "Asia/Kolkata", // Set to IST for consistency
		};
		return now.toLocaleString("en-US", options).replace(",", ", ") + " IST";
	};

	return (
		<div className="font-SecondaSoft text-white w-full h-[500px] bg-gray-800/40 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 shadow-[0_10px_20px_rgba(0,0,0,0.4)] border border-gray-700/30 relative overflow-hidden">
			{/* Subtle Gradient Overlay for Glass Effect */}
			<div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-transparent to-gray-900/20 opacity-70 z-0" />
			{/* Location Header */}
			<div className="flex items-center justify-center mt-6 mb-4 relative z-10">
				<p className="flex items-center text-lg sm:text-xl font-medium text-white bg-gray-800/30 backdrop-blur-lg px-3 py-1 rounded-full">
					<GoLocation size={20} color="white" className="cursor-pointer mr-2" />
					{data.city || "Loading..."}
				</p>
			</div>

			{/* Temperature and Weather Icon */}
			<div className="flex items-center justify-between py-2 text-center relative z-10">
				<div className="flex flex-row items-center w-full px-4 sm:px-6 max-[934px]:flex-col max-[934px]:items-center">
					<div className="relative flex-shrink-0">
						<img
							src={`icons/${data.weather[0].icon}.svg`}
							alt={data.weather[0].description || "weather icon"}
							className="drop-shadow-[0_20px_25px_rgba(0,0,0,0.35)] h-40 w-40 sm:h-52 sm:w-52 max-[934px]:h-32 max-[934px]:w-32 transition-transform duration-300 hover:scale-105"
						/>
					</div>
					<div className="flex flex-col items-center text-center ml-4 sm:ml-6 max-[934px]:mt-4 max-[934px]:ml-0">
						<div className="flex items-baseline">
							<p className="text-6xl sm:text-8xl font-bold text-white bg-gray-800/30 backdrop-blur-lg px-4 py-2 rounded-lg">
								{Math.round(data.main.temp)}
							</p>
							<span className="text-2xl sm:text-4xl font-light text-gray-300">
								°C
							</span>
						</div>
						<p className="text-gray-400 text-xs sm:text-sm mt-1 capitalize bg-gray-800/30 backdrop-blur-lg px-2 py-1 rounded">
							{data.weather[0].description || "No description"}
						</p>
					</div>
				</div>
			</div>

			{/* Date and Time */}
			<div className="flex items-center justify-center my-4 max-[934px]:my-2 relative z-10">
				<p className="text-gray-300 font-extralight text-xs sm:text-sm bg-gray-800/30 backdrop-blur-lg px-3 py-1 rounded">
					{getCurrentDateTime()}
				</p>
			</div>
			<hr className="border-gray-700/30 my-4 relative z-10" />

			{/* Additional Details */}
			<div className="flex flex-row justify-between items-center mt-4 px-4 sm:px-6 relative z-10">
				<div className="flex flex-col items-center text-center bg-gray-800/30 backdrop-blur-lg p-2 rounded-lg">
					<div className="flex justify-center mb-1">
						<img src={temp} alt="Temperature Feel" className="w-6 h-6 sm:w-8 sm:h-8" />
					</div>
					<p className="text-sm sm:text-base">{Math.round(data.main.feels_like)}°C</p>
					<p className="text-xs sm:text-sm text-gray-400">Feels Like</p>
				</div>
				<div className="flex flex-col items-center text-center bg-gray-800/30 backdrop-blur-lg p-2 rounded-lg">
					<div className="flex justify-center mb-1">
						<img src={humid} alt="Humidity" className="w-6 h-6 sm:w-8 sm:h-8" />
					</div>
					<p className="text-sm sm:text-base">{data.main.humidity}%</p>
					<p className="text-xs sm:text-sm text-gray-400">Humidity</p>
				</div>
				<div className="flex flex-col items-center text-center bg-gray-800/30 backdrop-blur-lg p-2 rounded-lg">
					<div className="flex justify-center mb-1">
						<img src={wind} alt="Wind Speed" className="w-6 h-6 sm:w-8 sm:h-8" />
					</div>
					<p className="text-sm sm:text-base">{data.wind.speed} km/h</p>
					<p className="text-xs sm:text-sm text-gray-400">Wind Speed</p>
				</div>
			</div>
		</div>
	);
};

export default TemperatureAndDetails;