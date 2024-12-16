import React, { useEffect, useState } from 'react';

function Watchlist({ currency }) {
  const [coins, setCoins] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem('visitedIds')) || [];
    setWatchlist(savedWatchlist);

    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&sparkline=false&price_change_percentage=24h`)
      .then(response => response.json())
      .then(data => {
        const filteredCoins = data.filter(coin => savedWatchlist.includes(coin.id));
        setCoins(filteredCoins);
      })
      .catch(error => console.error('Error fetching data: ', error));
  }, [currency]);

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

  const handleDelete = (coinId) => {
    const updatedWatchlist = watchlist.filter(id => id !== coinId);
    setWatchlist(updatedWatchlist);

    const updatedCoins = coins.filter(coin => coin.id !== coinId);
    setCoins(updatedCoins);

    localStorage.setItem('visitedIds', JSON.stringify(updatedWatchlist));
  };

  return (
    <div className='flex justify-between pb-14 '>
      <div className='bg-[hsla(0,0%,0%,25%)] w-[calc(100%-520px)]'></div>
      <div className='min-h-screen bg-[#515151]'>
        <div className=" w-[520px] bg-[#515151] p-9">
          <h2 className='text-center mb-10 font-medium text-3xl'>WATCHLIST</h2>
          <div className='flex flex-wrap gap-9'>
            {
              coins.length > 0 ? (coins.map(data => (
                <div key={data.id} className="bg-[#14161A] rounded-[25px] p-4 shadow-lg w-[198px]">
                  <img src={data.image} alt={data.name} className="w-16 h-16 mx-auto" />
                  <div className="mt-4 text-center">
                    <span className="text-white">
                      {getCurrencySymbol(currency)}{data.current_price.toString().split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (data.current_price % 1 !== 0 ? '.' + data.current_price.toString().split('.')[1] : '')}.00
                    </span>
                  </div>
                  <div className='flex justify-center mt-4'>
                    <button
                      className="mt-2 text-white bg-[#FF0000] py-1 px-4" onClick={() => handleDelete(data.id)}>Delete
                    </button>
                  </div>
                </div>
              ))
              ) : (
                <p className="text-center text-gray-500">No coins in your watchlist.</p>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Watchlist;
