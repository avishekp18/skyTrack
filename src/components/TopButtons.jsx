// src/components/TopButtons.jsx

import { topCities } from "../constants";

const TopButtons = ({ onSearchChange, currentLocation }) => {
	const handleCityClick = (city) => {
		if (onSearchChange && city.lat && city.lon) {
			onSearchChange({ value: `${city.lat} ${city.lon}`, label: city.title || "Current Location" });
		}
	};

	return (
		<div className="fixed inset-x-0 flex items-center justify-around my-6 max-[350px]:my-0 max-[370px]:text-[11px] top-14 text-white px-4 py-1 bg-white/10 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-grey z-[150]  animate-[fadeIn_0.5s_ease-out]">




			{
				currentLocation.lat && currentLocation.lon && (
					<button
						key="current"
						onClick={() => handleCityClick(currentLocation)}
						className="font-SecondaSoft text-sm sm:text-base font-medium hover:bg-gray-700 hover:text-white px-3 py-1 rounded-lg transition-all duration-300"
					>
						Your Location
					</button>
				)
			}
			{
				topCities.map((city) => (
					<button
						key={city.id}
						onClick={() => handleCityClick(city)}
						className="font-SecondaSoft text-sm sm:text-base font-medium hover:bg-gray-700 hover:text-white px-3 py-1 rounded-lg transition-all duration-300"
					>
						{city.title}
					</button>
				))
			}
		</div >
	);
};

export default TopButtons;