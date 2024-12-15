import React, { useState } from 'react';
import Watchlist from '../pages/Watchlist';

const Layout = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [isWatchlistVisible, setWatchlistVisible] = useState(false); // State to control visibility of Watchlist

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const toggleWatchlist = () => {
    setWatchlistVisible(prevState => !prevState); // Toggle visibility
    document.body.style.overflow = isWatchlistVisible ? "auto" : "hidden"; // Disable scrolling when watchlist is visible
  };

  return (
    <div>
      <header className='px-[344px] py-4 flex justify-between'>
        <h2 className='text-[#87CEEB] text-xl font-bold'>CRYPTOFOLIO</h2>
        <div className='flex gap-4'>
          <select
            id="currency"
            className='focus:border-transparent focus:outline-none bg-transparent'
            value={currency}
            onChange={handleCurrencyChange}
          >
            <option className='bg-black' value="USD">USD</option>
            <option className='bg-black' value="EUR">EUR</option>
            <option className='bg-black' value="JPY">JPY</option>
          </select>
          <button
            className='text-custom-black bg-[#87CEEB] px-5 py-2 rounded'
            onClick={toggleWatchlist} // Toggle Watchlist visibility on button click
          >
            WATCH LIST
          </button>
        </div>
      </header>

      {/* Fixed Watchlist */}
      {isWatchlistVisible && (
        <div className="fixed top-20 left-0 right-0 z-50  shadow-lg max-h-full overflow-y-auto">
          <Watchlist currency={currency} />
        </div>
      )}

      {/* Main Content */}
      <main className={isWatchlistVisible ? "overflow-hidden" : ""}>
        {React.cloneElement(children, { currency })}
      </main>
    </div>
  );
};

export default Layout;
