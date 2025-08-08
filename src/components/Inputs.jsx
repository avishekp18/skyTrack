import { useState } from "react";
import AsyncSelect from "react-select/async";
import { WEATHER_API_KEY } from "../components/Api";

function Inputs({ onSearchChange, isLoading }) {
	const [value, setValue] = useState(null);

	// Load options for AsyncSelect
	const loadOptions = async (input) => {
		if (!input) {
			return [];
		}
		try {
			const response = await fetch(
				`https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${WEATHER_API_KEY}`
			);
			const data = await response.json();
			return data.map((city) => ({
				value: `${city.lat} ${city.lon}`,
				label: `${city.name}, ${city.country}`,
			}));
		} catch (err) {
			console.error(err);
			return [];
		}
	};

	// Handle selection change
	const handleChange = (selected) => {
		setValue(selected);
		onSearchChange(selected);
	};

	return (
		<div className="w-full">
			<AsyncSelect
				cacheOptions
				defaultOptions={false}
				loadOptions={loadOptions}
				onChange={handleChange}
				value={value}
				isDisabled={isLoading}
				placeholder="Search for a city..."
				classNamePrefix="react-select"
				styles={{
					control: (base) => ({
						...base,
						backgroundColor: "rgba(255, 255, 255, 0.2)",
						borderRadius: "20px",
						padding: "0.5rem",
						border: "none",
					}),
					input: (base) => ({
						...base,
						color: "white",
					}),
					singleValue: (base) => ({
						...base,
						color: "white",
					}),
					menu: (base) => ({
						...base,
						backgroundColor: "rgba(255, 255, 255, 0.2)",
						backdropFilter: "blur(10px)",
						borderRadius: "20px",
					}),
					option: (base, { isFocused }) => ({
						...base,
						backgroundColor: isFocused ? "rgba(255, 255, 255, 0.3)" : "transparent",
						color: "white",
					}),
				}}
			/>
		</div>
	);
}

export default Inputs;
