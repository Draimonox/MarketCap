"use client";

// 1 . shows the same things as it for the coins, dw about anything above the list
// 2 . then i want filtering for price, marketcap, and alphabetical
// 3 . and when you click on a coin, it should open a modal that shows more details (whatever else the API provides)
// import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import Image from "next/image";
// import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

function MarketCap() {
  const [data, setData] = useState<CoinData[]>([]);
  const [openedCoinId, setOpenedCoinId] = useState<string | null>(null);
  const [ascending, setAscending] = useState(true);

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

  const handleOpenModal = (coinId: string) => {
    setOpenedCoinId(coinId);
  };

  const handleCloseModal = () => {
    setOpenedCoinId(null);
  };

  function handleSortPrice() {
    const sortData = [...data].sort((a, b) =>
      ascending
        ? a.current_price - b.current_price
        : b.current_price - a.current_price
    );
    setData(sortData);
    setAscending(!ascending);
  }
  function handleSort24h() {
    const sortData2 = [...data].sort((a, b) =>
      ascending ? a.high_24h - b.high_24h : b.high_24h - a.high_24h
    );
    setData(sortData2);
    setAscending(!ascending);
  }

  function handleSortRank() {
    const sortData = [...data].sort((a, b) =>
      ascending
        ? a.market_cap_rank - b.market_cap_rank
        : b.market_cap_rank - a.market_cap_rank
    );
    setData(sortData);
    setAscending(!ascending);
  }

  function handleSortVolume() {
    const sortData = [...data].sort((a, b) =>
      ascending
        ? a.total_volume - b.total_volume
        : b.total_volume - a.total_volume
    );
    setData(sortData);
    setAscending(!ascending);
  }
  return (
    <>
      <h1
        style={{
          margin: "25px",

          padding: "10px",
          borderRadius: "25px",
          cursor: "pointer",
          fontWeight: "bolder",
          textAlign: "center",
        }}
      >
        Crypto Market Cap
      </h1>
      <div
        style={{
          margin: "25px",
          marginBottom: "-15px",
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderRadius: "25px",
          cursor: "pointer",
          fontWeight: "bolder",
        }}
      >
        {" "}
        <h3 onClick={handleSortRank}>Rank</h3>
        <h3 style={{ marginLeft: "130px" }}>Name</h3>
        <h3 style={{ marginLeft: "130px" }}>Symbol</h3>
        <h3
          style={{ marginLeft: "115px", cursor: "point" }}
          onClick={handleSortPrice}
        >
          Current Price
        </h3>
        <h3
          style={{ marginLeft: "130px", cursor: "point" }}
          onClick={handleSort24h}
        >
          24h
        </h3>
        <h3
          style={{ marginLeft: "145px", cursor: "point" }}
          onClick={handleSortVolume}
        >
          Total Volume
        </h3>
      </div>

      <ul>
        {data.map((coin) => (
          <li
            key={coin.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "-35px",
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
                borderRadius: "15px",
                cursor: "pointer",
                // justifyContent: "space-between", // Use space-between to align items
              }}
              onClick={() => handleOpenModal(coin.id)}
            >
              <span
                style={{
                  marginRight: "140px",
                  marginLeft: "10px",
                  textAlign: "center",
                }}
              >
                #{coin.market_cap_rank}
              </span>
              <span
                className="coinName"
                style={{
                  marginRight: "10px",
                  width: "150px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {coin.name}
              </span>

              <Image
                src={coin.image}
                alt={coin.name}
                width={20}
                height={20}
                style={{ marginLeft: "10px" }}
                className="coinImage"
              />

              <span
                className="coinSymbol"
                style={{
                  width: "50px",
                  textAlign: "center",
                }}
              >
                {coin.symbol.toUpperCase()}{" "}
              </span>

              <span
                className="coinPrice"
                style={{
                  width: "100px",
                  marginLeft: "100px",
                  textAlign: "center",
                }}
              >
                ${coin.current_price}
              </span>

              <span
                style={{
                  width: "100px",
                  marginLeft: "100px",
                  textAlign: "center",
                }}
              >
                ${coin.high_24h.toLocaleString()}
              </span>
              <span
                style={{
                  width: "100px",
                  marginLeft: "100px",
                  textAlign: "center",
                }}
              >
                ${coin.market_cap}
              </span>
              <span
                style={{
                  // width: "100px",
                  marginLeft: "100px",
                  textAlign: "center",
                }}
              >
                {coin.circulating_supply.toLocaleString()}{" "}
                {coin.symbol.toLocaleUpperCase()}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {data.map((coin) => (
        <Modal
          opened={openedCoinId === coin.id}
          onClose={handleCloseModal}
          title="Coin Details"
          key={coin.id}
        >
          <div>
            <h2>{coin.name}</h2>
          </div>
        </Modal>
      ))}
    </>
  );
}

export default MarketCap;
