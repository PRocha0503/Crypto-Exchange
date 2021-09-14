import Details from "./Details";
import { useMemo } from "react";

const Crypto = ({ crypto, showDetails }) => {
	const cstyle = function (status) {
		if (status === "normal") {
			return { background: "Lavender" };
		} else if (status === "up") {
			return { background: "DarkSeaGreen" };
		} else if (status === "down") {
			return { background: "LightCoral" };
		}
		return { background: "pink" };
	};
	const click = (e) => {
		e.preventDefault();
		showDetails(crypto.id, crypto.name, "d1");
	};
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}

	const price = useMemo(
		() => (
			<div
				className="crypto"
				style={cstyle(crypto.status)}
				onDoubleClick={click}
			>
				<p>
					<img alt={crypto.name} src={crypto.imgsrc}></img>
				</p>
				<h2>
					{" "}
					{crypto.name}{" "}
					<p className="crypto price">
						{" "}
						{crypto.symbol}/USD ${numberWithCommas(crypto.priceUsd)}
					</p>
				</h2>
			</div>
		),
		[crypto]
	);
	const details = useMemo(
		() => (
			<Details
				chartData={crypto.chartData}
				name={crypto.name}
				id={crypto.id}
				rank={crypto.rank}
				symbol={crypto.symbol}
				showDetails={showDetails}
			/>
		),
		[crypto.chartData, crypto.name]
	);

	return (
		<>
			{price}
			{crypto.details && details}
		</>
	);
};
export default Crypto;
