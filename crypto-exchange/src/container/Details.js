import { Line } from "react-chartjs-2";
import ReactDOMServer from "react-dom/server";
import TradingViewWidget, { Themes } from "react-tradingview-widget";

const Details = ({ chartData, name, id, rank, symbol, showDetails }) => {
  console.log("RERENDER");
  const data = {
    labels: chartData[1],
    datasets: [
      {
        label: `${name}`,
        data: chartData[0],
        fill: true,
        backgroundColor: "coral",
        borderColor: "black",
      },
    ],
  };
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    chartArea: {
      backgroundColor: "black",
    },
  };
  const clickMinute = (e) => {
    e.preventDefault();
    showDetails(id, name, "m1", true);
  };
  const clickHour = (e) => {
    e.preventDefault();
    showDetails(id, name, "h1", true);
  };
  const clickDay = (e) => {
    e.preventDefault();
    showDetails(id, name, "d1", true);
  };

  return (
    <>
      <h5>Rank: {rank}</h5>
      <div>
        <h2> Candle Chart</h2>
      </div>
      <div className="chart">
        <TradingViewWidget
          symbol={`${symbol}USD`}
          theme={Themes.LIGHT}
          locale="en"
          autosize
        />
      </div>
      <div>
        <input
          className="btn btn-time"
          type="submit"
          value="Minute"
          onClick={clickMinute}
        ></input>
        <input
          className="btn btn-time"
          type="submit"
          value="Hour"
          onClick={clickHour}
        ></input>
        <input
          className="btn btn-time"
          type="submit"
          value="Day"
          onClick={clickDay}
        ></input>
      </div>
      <div className="crypto">
        <Line data={data} options={options} />
      </div>
    </>
  );
};
export default Details;
