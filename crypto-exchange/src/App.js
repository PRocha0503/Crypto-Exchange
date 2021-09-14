import Header from "./container/Header";
import Cryptos from "./container/Cryptos";
import Search from "./container/Search";
import cryptoData from "./data";

import { useState, useEffect, useRef } from "react";

//exp general page
const App = () => {
	//exp States and references
	const ws = useRef(null);
	const searchText = useRef("All");
	const [cryptoList, setCryptoList] = useState([...cryptoData]);
	const loaded = useRef(false);

	//exp useEffect to get inicial prices and cryptoList, runs once
	useEffect(() => {
		//exp calls the api to get initial info of price
		const initialInfo = async (number) => {
			var requestOptions = {
				method: "GET",
				redirect: "follow",
			};

			const data = await fetch(
				`https://api.coincap.io/v2/assets`,
				requestOptions
			);
			const prices = await data.json();
			const top_20 = prices.data.slice(0, number);
			console.log("FETCHED");
			return top_20;
		};
		//exp ads the cryptos to the state, adds some propeties for future use
		const initial = async () => {
			try {
				const info = await initialInfo(99);
				for (let i of info) {
					i.imgsrc = `https://assets.coincap.io/assets/icons/${i.symbol.toLocaleLowerCase()}@2x.png`;
					i.details = false;
					i.chartData = {};
					i.status = "normal";
					i.priceUsd = parseFloat(i.priceUsd, 10).toFixed(3);
				}
				setCryptoList(info);
				console.log(loaded.current);
				loaded.current = true;
			} catch {
				//exp in case it does not load
				window.location.reload();
			}
		};
		initial();
	}, []);
	//exp useEffect to open WebSocket, is rerun when the useRef of loaded changes
	useEffect(() => {
		let names = cryptoList.map((crypto) =>
			crypto.name.toLocaleLowerCase().replace(" ", "-")
		);
		console.log(names);
		names = names.toString();
		const link = "wss://ws.coincap.io/prices?assets=";
		let wsName = link.concat(names);
		console.log(wsName);
		ws.current = new WebSocket(wsName);
		ws.current.onopen = () => console.log("ws opened");
		ws.current.onclose = () => console.log("ws closed");
		return () => {
			ws.current.close();
		};
	}, [loaded.current]);
	//exp useEffect to update price every time the price changes
	useEffect(() => {
		if (!ws.current) return;
		//exp set new price and change color
		const updatePrice = async (name, newPrice) => {
			setCryptoList(
				cryptoList.map((crypto) =>
					crypto.id === name.toLocaleLowerCase()
						? {
								...crypto,
								priceUsd: newPrice,
								status: crypto.priceUsd < newPrice ? "up" : "down",
						  }
						: crypto
				)
			);
		};
		//exp is done every time a message from the webSocket is recived
		ws.current.onmessage = (e) => {
			const data = JSON.parse(e.data);
			for (let key of Object.keys(data)) {
				let newPrice = data[key];
				//console.log(key + " -> " + data[key])
				for (let cItem of cryptoList) {
					if (key.toLowerCase() === cItem.id) {
						updatePrice(key, newPrice);
					}
				}
			}
		};
	}, [cryptoList]);
	//exp cahnges the search useRef
	const search = (text) => {
		searchText.current = text;
	};
	//exp shows all cryptos
	const resetSearch = () => {
		searchText.current = "All";
	};
	//exp is done to show cryptos charts
	const showDetails = (id, name, time, update = false) => {
		let data = cryptoList.filter((crypto) => crypto.id === id)[0].chartData;
		if (Object.entries(data).length === 0 || update) {
			console.log("TAMAÑO", Object.entries(data).length === 0);
			const chance = async () => {
				try {
					let hisData = await fetchData(
						name.toLocaleLowerCase().replace(" ", "-"),
						time
					);
					setCryptoList(
						cryptoList.map((crypto) =>
							crypto.id === id
								? { ...crypto, chartData: hisData, details: true }
								: crypto
						)
					);
				} catch (e) {
					alert(e);
					setCryptoList(
						cryptoList.map((crypto) =>
							crypto.id === id ? { ...crypto, details: false } : crypto
						)
					);
				}
			};
			chance();
		} else {
			setCryptoList(
				cryptoList.map((crypto) =>
					crypto.id === id ? { ...crypto, details: !crypto.details } : crypto
				)
			);
		}
	};

	const fetchData = async (name, time) => {
		const data = await fetch(
			`https://api.coincap.io/v2/assets/${name}/history?interval=${time}`
		);
		const bd = await data.json();
		const cleanData = [];
		let price = [];
		let label = [];
		for (let pricePoint of bd.data) {
			price.push(pricePoint.priceUsd);
			label.push(pricePoint.date.substring(0, pricePoint.date.indexOf("T")));
		}
		cleanData.push(price);
		cleanData.push(label);
		return cleanData;
	};

	return (
		<>
			<Header resetSearch={resetSearch} />
			<div className="margin">
				<Search search={search} />
				<div className="container">
					<h2>Crypo List</h2>
					<Cryptos
						cryptoList={cryptoList}
						search={searchText.current}
						showDetails={showDetails}
					/>
				</div>
			</div>
		</>
	);
};

export default App;
