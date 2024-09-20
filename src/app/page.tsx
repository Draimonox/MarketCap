"use client";

// 1 . shows the same things as it for the coins, dw about anything above the list
// 2 . then i want filtering for price, marketcap, and alphabetical
// 3 . and when you click on a coin, it should open a modal that shows more details (whatever else the API provides)
import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import Image from "next/image";

function MarketCap() {
  const [data, setData] = useState<CoinData[]>([]);

  interface CoinData {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    high_24h: number;
    low_24h: number;
    market_cap: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    market_cap_rank: number;
    fully_diluted_valuation: number;
    total_volume: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number | null;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    price_change_24h: number;
    price_change_percentage_24h: number;
    roi: {
      currency: string;
      percentage: number;
      times: number;
    } | null;
    last_updated: string;
  }

  async function coinAPI() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
      );

      const data = await response.json();
      console.log(data);
      setData(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    coinAPI();
  }, []);

  return (
    <>
      <h1>COIN MARKET CAP</h1>
      <ul>
        {data.map((coin) => (
          <li
            key={coin.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "-5px",
            }}
          >
            <div
              key={coin.id}
              style={{
                borderStyle: "solid",
                borderColor: "black",
                borderWidth: "2px",
                width: "100%",
                margin: "25px",
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderRadius: "25px",
                cursor: "pointer",
              }}
              onClick={() => {}}
            >
              <span className="coinName" style={{ marginRight: "10px" }}>
                {coin.name}
              </span>

              <Image
                src={coin.image}
                alt={coin.name}
                width={20}
                height={20}
                style={{ marginLeft: "1%" }}
                className="coinImage"
              />
              <span className="coinSymbol" style={{}}>
                {coin.symbol}
              </span>
              <span className="coinPrice" style={{ marginLeft: "15%" }}>
                Current Price: {coin.current_price}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default MarketCap;
