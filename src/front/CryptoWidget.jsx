import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar los componentes de Chart.js una sola vez
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CRYPTO_LINKS = {
  bitcoin: {
    exchanges: {
      binance: "https://www.binance.com/es/trade/BTC_EUR",
      coinbase: "https://www.coinbase.com/es/price/bitcoin"
    },
    info: "https://www.coingecko.com/es/monedas/bitcoin",
    chartColor: "#f7931a"
  },
  ethereum: {
    exchanges: {
      binance: "https://www.binance.com/es/trade/ETH_EUR",
      coinbase: "https://www.coinbase.com/es/price/ethereum"
    },
    info: "https://www.coingecko.com/es/monedas/ethereum",
    chartColor: "#627eea"
  },
  dogecoin: {
    exchanges: {
      binance: "https://www.binance.com/es/trade/DOGE_EUR",
      coinbase: "https://www.coinbase.com/es/price/dogecoin"
    },
    info: "https://www.coingecko.com/es/monedas/dogecoin",
    chartColor: "#cb9800"
  }
};

const CryptoWidget = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [historicalData, setHistoricalData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const marketRes = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=bitcoin,ethereum,dogecoin"
        );
        const marketData = await marketRes.json();

        const historicalPromises = marketData.map(async coin => {
          const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=eur&days=7&interval=daily`
          );
          return await res.json();
        });

        const historicalResults = await Promise.all(historicalPromises);

        setCryptoData(marketData);
        setHistoricalData(
          marketData.reduce((acc, coin, index) => ({
            ...acc,
            [coin.id]: historicalResults[index]
          }), {})
        );

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const prepareChartData = (coinId) => {
    const data = historicalData[coinId];
    if (!data?.prices) return null;

    return {
      labels: data.prices.map(([timestamp]) =>
        new Date(timestamp).toLocaleDateString("es-ES", { day: 'numeric', month: 'short' })
      ),
      datasets: [{
        data: data.prices.map(([, price]) => price),
        borderColor: CRYPTO_LINKS[coinId].chartColor,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0
      }]
    };
  };

  if (loading) return (
    <div className="d-flex justify-content-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="row g-4">
        {cryptoData.map(coin => {
          const chartData = prepareChartData(coin.id);
          const links = CRYPTO_LINKS[coin.id];

          return (
            <div key={coin.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <a
                      href={links.info}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none text-dark"
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          width="40"
                          height="40"
                          className="me-3"
                        />
                        <h5 className="mb-0">{coin.name}</h5>
                      </div>
                    </a>
                    <span className={`badge ${
                      coin.price_change_percentage_24h >= 0 ? 'bg-success' : 'bg-danger'
                    }`}>
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </div>

                  <div className="my-2">
                    <h3 className="fw-bold">
                      {coin.current_price.toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: coin.current_price < 1 ? 4 : 2
                      })}
                    </h3>
                  </div>

                  {chartData && (
                    <div className="mb-3" style={{ height: "150px" }}>
                      <Line
                        key={coin.id} // 👈 Importante para evitar errores de canvas duplicado
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: { enabled: true }
                          },
                          scales: {
                            x: { display: false },
                            y: { display: false }
                          },
                          interaction: {
                            intersect: false,
                            mode: 'index'
                          }
                        }}
                      />
                    </div>
                  )}

                  <div className="mt-auto d-grid gap-2">
                    <a
                      href={links.exchanges.binance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                    >
                      Comprar en Binance
                    </a>
                    <a
                      href={links.exchanges.coinbase}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Comprar en Coinbase
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoWidget;