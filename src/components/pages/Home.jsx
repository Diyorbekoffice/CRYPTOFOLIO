import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Criptolist from "./Criptolist";

const Home = ({ currency }) => {
  const [cryptoData, setCryptoData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visitedIds, setVisitedIds] = useState(() => {
    return JSON.parse(localStorage.getItem("visitedIds")) || []; 
  });

  const navigate = useNavigate(); 

  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&sparkline=false&price_change_percentage=24h`
    )
      .then((response) => response.json())
      .then((data) => {
        setCryptoData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currency]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cryptoData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [cryptoData]);

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "JPY":
        return "¥";
      default:
        return "$";
    }
  };

  const handlePageDetails = (id) => {
    if (!visitedIds.includes(id)) {
      const updatedIds = [...visitedIds, id];
      setVisitedIds(updatedIds); // Update state
      localStorage.setItem("visitedIds", JSON.stringify(updatedIds)); // Save to localStorage
    }
    navigate(`/details/${id}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="home-page pt-16 pb-14 text-center flex flex-col">
        <h1 className="text-[#87CEEB] text-6xl font-bold font-montserrat">
          CRYPTOFOLIO WATCH LIST
        </h1>
        <p className="text-[#A9A9A9] text-sm font-medium font-montserrat mt-4">
          Get all the Info regarding your favorite Crypto Currency
        </p>
        <div className="flex justify-center gap-40 mt-11">
          {cryptoData.slice(currentIndex, currentIndex + 4).map((data) => (
            <div
              key={data.id}
              onClick={() => handlePageDetails(data.id)}
              className="flex flex-col gap-3 items-center text-center cursor-pointer"
            >
              <img
                className="w-20 h-20"
                src={data.image}
                alt={`${data.name}`}
              />
              <div>
                <div>
                  <span>{data.name}</span>
                  <span
                    className={`ml-2 w-32 text-right ${
                      data.price_change_percentage_24h > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {data.price_change_percentage_24h > 0 ? "+" : ""}
                    {data.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </div>
                <span>
                  {getCurrencySymbol(currency)}
                  {data.current_price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Criptolist currency={currency} visitedIds={visitedIds} />
    </div>
  );
};

export default Home;
