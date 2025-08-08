import React from "react";
import { FiSunrise, FiSunset } from "react-icons/fi";
import { TbSunHigh, TbSunLow } from "react-icons/tb";

const SunriseAndSunset = ({ data }) => {
	// Format Unix timestamp to time string
	const formatTime = (unixTimestamp) => {
		const date = new Date(unixTimestamp * 1000);
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
			timeZone: "Asia/Kolkata",
		});
	};

	// Crystal card style — very transparent with inner shadows & subtle highlights
	const cardClass = `
    relative
    flex flex-col items-center justify-center text-center gap-1
    bg-white/10
    backdrop-blur-[40px]
    rounded-xl
    border border-white/20
    shadow-[inset_0_0_15px_rgba(255,255,255,0.3),0_4px_30px_rgba(0,0,0,0.1)]
    p-5
    transition
    duration-300
    ease-in-out
    hover:bg-white/20
    cursor-default
  `;

	const labelClass = "text-xs text-white/70 font-light";
	const valueClass = "text-sm font-semibold text-white";

	const items = [
		{
			label: "Sunrise",
			value: formatTime(data.sys?.sunrise),
			icon: <FiSunrise size={22} className="text-yellow-400" />,
		},
		{
			label: "Sunset",
			value: formatTime(data.sys?.sunset),
			icon: <FiSunset size={22} className="text-orange-400" />,
		},
		{
			label: "High",
			value: `${Math.round(data.main?.temp_max) || "--"}°C`,
			icon: <TbSunHigh size={22} className="text-yellow-500" />,
		},
		{
			label: "Low",
			value: `${Math.round(data.main?.temp_min) || "--"}°C`,
			icon: <TbSunLow size={22} className="text-blue-400" />,
		},
		{
			label: "Pressure",
			value: `${data.main?.pressure || "--"} hPa`,
			icon: null,
		},
		{
			label: "Visibility",
			value: `${data.visibility ? (data.visibility / 1000).toFixed(1) : "--"} km`,
			icon: null,
		},
		{
			label: "Wind Gust",
			value: `${data.wind?.gust || "N/A"} m/s`,
			icon: null,
		},
	];

	return (
		<div
			className="
        w-full max-w-md mx-auto
        bg-white/5
        backdrop-blur-[50px]
        rounded-2xl
        border border-white/20
        shadow-[inset_0_0_50px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.15)]
        p-8
        text-white
        font-sans
        relative
        overflow-hidden
      "
			style={{
				WebkitBackdropFilter: "blur(50px)",
				backdropFilter: "blur(50px)",
			}}
		>
			{/* Optional crystal shine highlight */}
			<div
				className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-2xl"
				style={{
					background:
						"linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
					mixBlendMode: "screen",
					filter: "blur(15px)",
					zIndex: 0,
				}}
			></div>

			<div className="relative z-10 grid grid-cols-2 sm:grid-cols-4  gap-4 w-full h-full">
				{items.map((item, index) => (
					<div key={index} className={cardClass}>
						{/* {item.icon && <div className="mb-2">{item.icon}</div>} */}
						<p className={valueClass}>{item.value}</p>
						<p className={labelClass}>{item.label}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default SunriseAndSunset;
