import { FiSunrise, FiSunset } from "react-icons/fi";
import { TbSunHigh, TbSunLow } from "react-icons/tb";

const SunriseAndSunset = ({ data }) => {
	const formatTime = (unixTimestamp) => {
		const date = new Date(unixTimestamp * 1000);
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	};

	const cardClass =
		"flex flex-col justify-center items-center text-center gap-2 bg-white/10 border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.2)]";

	const labelClass = "text-sm text-gray-300 font-light";
	const valueClass = "text-base text-white font-semibold";

	const items = [
		{
			label: "Sunrise",
			value: formatTime(data.sys.sunrise),
			icon: <FiSunrise size={24} className="text-yellow-400" />,
		},
		{
			label: "Sunset",
			value: formatTime(data.sys.sunset),
			icon: <FiSunset size={24} className="text-orange-400" />,
		},
		{
			label: "High",
			value: `${Math.round(data.main.temp_max)}°C`,
			icon: <TbSunHigh size={24} className="text-yellow-500" />,
		},
		{
			label: "Low",
			value: `${Math.round(data.main.temp_min)}°C`,
			icon: <TbSunLow size={24} className="text-blue-400" />,
		},
		{
			label: "Pressure",
			value: `${data.main.pressure} hPa`,
			icon: null,
		},
		{
			label: "Visibility",
			value: `${data.visibility / 1000} km`,
			icon: null,
		},
		{
			label: "Wind Gust",
			value: `${data.wind.gust || "N/A"} m/s`,
			icon: null,
		},

	];

	return (
		<div className="font-SecondaSoft w-full h-[400px] max-w-3xl mx-auto bg-gray-800/30 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.4)] border border-white/10 relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-50 pointer-events-none rounded-2xl" />

			<div className="relative z-10 grid grid-cols-3 gap-4">
				{items.map((item, index) => (
					<div key={index} className={cardClass}>
						{item.icon && item.icon}
						<p className={labelClass}>{item.label}</p>
						<p className={valueClass}>{item.value}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default SunriseAndSunset;
