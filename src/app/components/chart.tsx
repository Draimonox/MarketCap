import React, { useEffect, useRef } from "react";
import { createChart, IChartApi } from "lightweight-charts";

interface CryptoChartProps {
  token: string;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ token }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        textColor: "black",
      },
      grid: {
        vertLines: {
          color: "#444",
        },
        horzLines: {
          color: "#444",
        },
      },
      timeScale: {
        borderColor: "#444",
      },
    });

    chartRef.current = chart;

    const lineSeries = chart.addLineSeries({
      color: "#f39c12",
    });

    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${token}/market_chart?vs_currency=usd&days=30`
        );
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();

        const formattedData = data.prices.map(
          ([time, value]: [number, number]) => ({
            time: Math.floor(time / 1000),
            value,
          })
        );

        lineSeries.setData(formattedData);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptoData();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.resize(
          chartContainerRef.current.clientWidth,
          chartContainerRef.current.clientHeight
        );
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [token]);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: "relative", width: "100%", height: "400px" }}
    />
  );
};

export default CryptoChart;
