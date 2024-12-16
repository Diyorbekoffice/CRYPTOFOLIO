import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import EysNO from '../../assets/images/EyeNo.svg';
import EysYes from '../../assets/images/EyeYes.svg';

function Criptolist({ currency }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [visitedIds, setVisitedIds] = useState(() => {
    return JSON.parse(localStorage.getItem('visitedIds')) || [];
  });
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&sparkline=false&price_change_percentage=24h`
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currency]);

  const handlePageDetails = (id) => {
    const storedIds = JSON.parse(localStorage.getItem('visitedIds')) || [];

    if (!storedIds.includes(id)) {
      const updatedIds = [...storedIds, id];
      localStorage.setItem('visitedIds', JSON.stringify(updatedIds));
      setVisitedIds(updatedIds);
    }

    navigate(`/details/${id}`);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'JPY':
        return '¥';
      default:
        return '$';
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="my-5 mx-80">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search For a Crypto Currency.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-black bgw-full px-4 py-2 border border-slate-700 rounded-md focus:outline-none w-full"
        />
      </div>
      <div className="px-4 py-7 bg-[#87CEEB] text-black rounded-t-lg font-bold flex justify-between">
        <span className="w-36">Coin</span>
        <span className="w-32 text-right">Price</span>
        <span className="w-32 text-right">24h Change</span>
        <span className="w-32 text-right">Market Cap</span>
      </div>
      {currentItems.length > 0 &&
        currentItems.map((data) => (
          <div
            key={data.id}
            onClick={() => handlePageDetails(data.id)}
            className="border-b-[1px] border-neutral-700 px-4 py-7 flex justify-between cursor-pointer"
          >
            <div className="flex gap-4 w-36">
              <img className="w-12 h-12" src={data.image} alt="cripto_img" />
              <div className="flex flex-col justify-between ">
                <span className="font-roboto text-xl">{data.symbol.toUpperCase()}</span>
                <span className="font-roboto text-sm text-[#A9A9A9]">{data.name}</span>
              </div>
            </div>
            <span className="w-32 text-right">
              {getCurrencySymbol(currency)}
              {data.current_price
                .toString()
                .split('.')[0]
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                (data.current_price % 1 !== 0
                  ? '.' + data.current_price.toString().split('.')[1]
                  : '')}
            </span>
            <div className="flex justify-end items-center w-32">
              <span>
                {visitedIds.includes(data.id) ? (
                  <img src={EysYes} alt="Visited" className="w-6 h-6" />
                ) : (
                  <img src={EysNO} alt="Not Visited" className="w-6 h-6" />
                )}
              </span>
              <span
                className={`ml-2 text-right ${
                  data.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {data.price_change_percentage_24h > 0 ? '+' : ''}
                {data.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
            <span className="w-32 text-right">{getCurrencySymbol(currency)} {data.market_cap.toString().slice(0, -6).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} M </span>
          </div>
        ))}
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        pageCount={Math.ceil(filteredData.length / itemsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={'flex justify-center gap-2 my-4 items-center'}
        pageClassName={'px-4 py-2  text-[#87CEEB] rounded-full'}
        activeClassName={'bg-zinc-600 '}
        disabledClassName={'text-[#87CEEB]'}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
      />
    </div>
  );
}

export default Criptolist;
