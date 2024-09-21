"use client";

// 1 . shows the same things as it for the coins, dw about anything above the list
// 2 . then i want filtering for price, marketcap, and alphabetical
// 3 . and when you click on a coin, it should open a modal that shows more details (whatever else the API provides)
// import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import "./globals.css";
import Image from "next/image";
// import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";

function MarketCap() {
  const [data, setData] = useState<CoinData[]>([]);
  const [openedCoinId, setOpenedCoinId] = useState<string | null>(null);
  const [ascending, setAscending] = useState(true);
  const [sortProperty, setSortProperty] = useState<keyof CoinData | null>(null);

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

  function handleSort(property: keyof CoinData) {
    const sortData = [...data].sort((a, b) => {
      const aValue = a[property] ?? 0;
      const bValue = b[property] ?? 0;
      return ascending
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });
    setData(sortData);
    setAscending(!ascending);
    setSortProperty(property);
  }

  function handleReset() {
    const resetData = [...data].sort((a, b) => b.market_cap - a.market_cap);
    setData(resetData);
    setSortProperty(null);
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
        <h3 onClick={() => handleSort("market_cap_rank")}>Rank</h3>
        {sortProperty === "market_cap_rank" &&
          (ascending ? <MdOutlineArrowDropDown /> : <MdOutlineArrowDropUp />)}
        <h3 style={{ marginLeft: "130px" }}>Name</h3>
        <h3 style={{ marginLeft: "130px" }}>Symbol</h3>
        <h3
          style={{ marginLeft: "115px", cursor: "pointer" }}
          onClick={() => handleSort("current_price")}
        >
          Current Price
        </h3>
        {sortProperty === "current_price" &&
          (ascending ? <MdOutlineArrowDropDown /> : <MdOutlineArrowDropUp />)}
        <h3
          style={{ marginLeft: "140px", cursor: "pointer" }}
          onClick={() => handleSort("high_24h")}
        >
          24h High
        </h3>
        {sortProperty === "high_24h" &&
          (ascending ? <MdOutlineArrowDropDown /> : <MdOutlineArrowDropUp />)}
        <h3
          style={{ marginLeft: "120px", cursor: "pointer" }}
          onClick={() => handleSort("total_volume")}
        >
          Total Volume(24h)
        </h3>
        {sortProperty === "total_volume" &&
          (ascending ? <MdOutlineArrowDropDown /> : <MdOutlineArrowDropUp />)}
        <h3
          style={{ marginLeft: "75px", cursor: "pointer" }}
          onClick={() => handleSort("circulating_supply")}
        >
          Circulating Supply
        </h3>
        {sortProperty === "circulating_supply" &&
          (ascending ? <MdOutlineArrowDropDown /> : <MdOutlineArrowDropUp />)}
        <Button
          size="xs"
          color="gray"
          style={{ marginLeft: "75px", cursor: "pointer" }}
          onClick={handleReset}
        >
          Reset Filters
        </Button>
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
                background:
                  "linear-gradient(to bottom, rgb(83, 120, 149) 1%,  rgb(9, 32, 63) 75%)",
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
                #{coin.market_cap_rank.toLocaleString()}
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
                {coin.symbol.toUpperCase()}
              </span>

              <span
                className="coinPrice"
                style={{
                  width: "100px",
                  marginLeft: "100px",
                  textAlign: "center",
                }}
              >
                ${coin.current_price.toLocaleString()}
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
                ${coin.total_volume.toLocaleString()}
              </span>
              <span
                style={{
                  marginLeft: "100px",
                  textAlign: "center",
                }}
              >
                {coin.circulating_supply.toLocaleString()}{" "}
                {coin.symbol.toUpperCase()}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {data.map((coin) => (
        <Modal
          opened={openedCoinId === coin.id}
          styles={{
            content: {
              background:
                "linear-gradient( to right, rgb(0, 40, 70) -4.8%, rgb(255, 115, 115) 82.7%, rgb(255, 175, 123) 97.2%)", // Change the background color
              color: "white",
              fontWeight: "bold", // Change the text color
            },
            header: {
              background:
                "linear-gradient( to right, rgb(0, 40, 70) -4.8%, rgb(255, 115, 115) 82.7%, rgb(255, 175, 123) 97.2%)", // Header background color
              color: "white",
            },
            title: {
              fontWeight: "bolder",
            },
          }}
          onClose={handleCloseModal}
          title="Coin Details:"
          key={coin.id}
        >
          <div style={{ color: "white" }}>
            <h2
              style={{ fontWeight: "bold", display: "flex", marginTop: "25px" }}
            >
              {coin.name}{" "}
              <Image
                style={{ marginLeft: "5px" }}
                src={coin.image}
                alt={coin.name}
                width={25}
                height={25}
              />
            </h2>

            <p style={{ fontWeight: "bold" }}>Symbol: {coin.symbol}</p>
            <p style={{ fontWeight: "bold" }}>
              Current Rank: #{coin.market_cap_rank.toLocaleString()}
            </p>
            <p style={{ fontWeight: "bold" }}>
              Current Price: ${coin.current_price.toLocaleString()}
            </p>
            <p style={{ fontWeight: "bold" }}>
              Market Cap: ${coin.market_cap.toLocaleString()}
            </p>
            <p style={{ fontWeight: "bold" }}>
              Price Change (24h): ${coin.price_change_24h.toLocaleString()}
            </p>
            <p style={{ fontWeight: "bold" }}>
              Price Change % (24h):{" "}
              {coin.price_change_percentage_24h.toLocaleString()}%
            </p>
            <p style={{ fontWeight: "bold" }}>
              24h High: ${coin.high_24h.toLocaleString()}
            </p>
            <p style={{ fontWeight: "bold" }}>
              24h Low: ${coin.low_24h.toLocaleString()}
            </p>
            <p style={{ fontWeight: "bold" }}>
              Total Volume: ${coin.total_volume.toLocaleString()}
            </p>
            <p style={{ fontWeight: "bold" }}>
              Market Cap Change: ${coin.market_cap_change_24h.toLocaleString()}
            </p>
            <p style={{ fontWeight: "bold" }}>
              Market Cap % Change:{" "}
              {coin.market_cap_change_percentage_24h.toLocaleString()}%
            </p>
            <p style={{ fontWeight: "bold" }}>
              Circulating Supply: {coin.circulating_supply.toLocaleString()}{" "}
              {coin.symbol.toUpperCase()}
            </p>
            <p style={{ fontWeight: "bold" }}>
              Total Supply: {coin.total_supply.toLocaleString()}{" "}
              {coin.symbol.toUpperCase()}
            </p>
            <p style={{ fontWeight: "bold" }}>
              Max Supply: {coin.max_supply?.toLocaleString()}{" "}
              {coin.symbol.toUpperCase()}
            </p>
            <p style={{ fontWeight: "bold" }}>
              All-Time High: ${coin.ath.toLocaleString()}{" "}
            </p>
            <p style={{ fontWeight: "bold" }}>
              All-Time High % Change:{" "}
              {coin.ath_change_percentage.toLocaleString()}%
            </p>
            <p style={{ fontWeight: "bold" }}>
              All-Time High Date: {coin.ath_date}
            </p>
            <p style={{ fontWeight: "bold" }}>
              All-Time Low: ${coin.atl.toLocaleString()}{" "}
            </p>
            <p style={{ fontWeight: "bold" }}>
              All-Time Low % Change:{" "}
              {coin.atl_change_percentage.toLocaleString()}%
            </p>
            <p style={{ fontWeight: "bold" }}>
              All-Time Low Date: {coin.atl_date}
            </p>
          </div>
        </Modal>
      ))}
    </>
  );
}

export default MarketCap;
