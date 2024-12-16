import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Chart from 'react-apexcharts';

const Details = ({ currency }) => {
  const { id } = useParams();
  const [coinDetails, setCoinDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [days, setDays] = useState(1);

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCoinDetails(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency.toLowerCase()}&days=${days}`
    )
      .then((response) => response.json())
      .then((data) => {
        const prices = data.prices;
        setChartData(prices.map((price) => price[1]));

        if (days === 365) {
          // 1 yil uchun o'rtacha narxni hisoblash
          const monthlyPrices = Array(12).fill().map(() => []);
          const monthlyLabels = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];

          prices.forEach((price) => {
            const date = new Date(price[0]);
            const month = date.getMonth(); // Oyni olish
            monthlyPrices[month].push(price[1]); // Har oydagi narxlarni yig'ish
          });

          // Har bir oy uchun o'rtacha narxni hisoblash
          const averageMonthlyPrices = monthlyPrices.map((prices) => {
            const sum = prices.reduce((a, b) => a + b, 0);
            return prices.length ? sum / prices.length : 0;
          });

          setChartData(averageMonthlyPrices);
          setChartLabels(monthlyLabels);
        } else if (days === 1) {
          // 1 kunlik (soatlik) narxlar, faqat soatning 45-daqiqasidagi narxlarni olish
          const hourlyPrices = [];
          const hourlyLabels = [];

          // Change this section to capture both 15 and 45 minutes
          prices.forEach((price) => {
            const date = new Date(price[0]);
            const minute = date.getMinutes();

            if (minute === 15 || minute === 45) {
              const hour = date.getHours();
              const ampm = hour >= 12 ? 'PM' : 'AM';  // AM/PM format
              const hourIn12 = hour % 12 || 12;  // Convert to 12-hour format

              hourlyPrices.push(price[1]);
              hourlyLabels.push(`${hourIn12}:${minute < 10 ? '0' + minute : minute} ${ampm}`);
            }
          });

          setChartLabels(hourlyLabels);
          setChartData(hourlyPrices);
        } else if (days === 30) {
          // 30 kunlik (kunlik) narxlar, har kun uchun aniq sana
          const dailyPrices = Array(30).fill().map(() => []);
          const dailyLabels = [];

          prices.forEach((price) => {
            const date = new Date(price[0]);
            const day = date.getDate();
            const month = date.getMonth() + 1;  // 1-12 oy raqami
            const year = date.getFullYear();

            const formattedDate = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
            dailyPrices[day - 1] = price[1];
            if (!dailyLabels.includes(formattedDate)) {
              dailyLabels.push(formattedDate); // Sanani qo'shish
            }
          });

          // Oxirgi narxni hozirgi narxga yangilash
          const currentPrice = prices[prices.length - 1][1];
          dailyPrices[dailyPrices.length - 1] = currentPrice; // Oxirgi kunni hozirgi narx bilan almashtirish
          setChartData(dailyPrices);
          setChartLabels(dailyLabels);
        } else if (days === 90) {
          // 3 oy uchun (har 10 kunlik) narxlar
          const threeMonthsPrices = [];
          const threeMonthsLabels = [];

          const interval = 10; // Har 10 kunlik interval

          for (let i = 0; i < prices.length; i += interval) {
            const slice = prices.slice(i, i + interval);
            const averagePrice = slice.reduce((acc, price) => acc + price[1], 0) / slice.length;
            threeMonthsPrices.push(averagePrice);

            const date = new Date(slice[0][0]);
            const label = `${date.getDate()}-${date.getMonth() + 1}`;
            threeMonthsLabels.push(label);
          }

          setChartData(threeMonthsPrices);
          setChartLabels(threeMonthsLabels);
        } else {
          setChartLabels(prices.map((price) => new Date(price[0]).toLocaleDateString()));
        }
      })
      .catch((error) => console.error('Error fetching chart data:', error));
  }, [id, currency, days]);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  const options = {
    chart: {
      id: 'crypto-chart',
      type: 'area',
      background: '#14161A',
      toolbar: {
        show: false,
      },
    },
    theme: {
      mode: 'dark',
    },
    xaxis: {
      categories: chartLabels,
      labels: {
        style: {
          colors: '#414244',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#414244',
        },
        formatter: (value) => {
          return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
      },
    },
    grid: {
      borderColor: '#000',
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: true,
          color: '#000',
        },
      },
      yaxis: {
        lines: {
          show: true,
          color: '#000',
        },
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#00BFFF'],
        shadeIntensity: 1,
        type: 'vertical',
        opacityFrom: 0.1,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (value) => {
          return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
      },
    },
  };

  const series = [
    {
      name: `Price (Past ${days} Days) in ${currency}`,
      data: chartData,
    },
  ];

  const handleDaysChange = (newDays) => {
    setDays(newDays);
  };

  return (
    <div className="details-container p-6">
      <div className="coin-info flex gap-14">
        <div className='flex flex-col w-[547px] gap-5 font-montserrat'>
          <div className='flex flex-col gap-5 items-center'>
            <img className='w-52 h-52' src={coinDetails.image.large} alt="" />
            <h2 className='font-bold text-5xl'>{coinDetails.name}</h2>
          </div>
          <p className='text-left text-base'>{coinDetails.description.en.split('. ').slice(0, 2).join('. ') + '.'} </p>
          <span className='text-left font-bold text-2xl'>Rank: <span className=' font-normal'>{coinDetails.market_cap_rank}</span></span>
          <span className='text-left font-bold text-2xl'>Current Price: <span className="w-32 text-right font-normal">{getCurrencySymbol(currency)}{(coinDetails.market_data.current_price[currency.toLowerCase()]).toString().split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (coinDetails.market_data.current_price[currency.toLowerCase()] % 1 !== 0 ? '.' + coinDetails.market_data.current_price[currency.toLowerCase()].toString().split('.')[1] : '')}</span></span>
          <span className='text-left font-bold text-2xl'>Current Price: <span className=' font-normal'>{getCurrencySymbol(currency)}{(coinDetails.market_data.market_cap[currency.toLowerCase()]).toString().slice(0, -6).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} M</span></span>
        </div>

        {/* Tugmalar */}
        <div className='w-[1290px]'>
          <div className="chart-container">
            <Chart options={options} series={series} type="area" height={646} />
          </div>
          <div className="coin-buttons flex gap-4 mb-6">
            <button
              onClick={() => handleDaysChange(1)}
              className="w-[280px] border border-[#87CEEB] text-white px-4 py-2 rounded-md hover:bg-[#87CEEB] hover:text-black transition hover:font-bold"
            >
              24h
            </button>
            <button
              onClick={() => handleDaysChange(30)}
              className="w-[280px] border border-[#87CEEB] text-white px-4 py-2 rounded-md hover:bg-[#87CEEB] hover:text-black transition hover:font-bold"
            >
              30 Days
            </button>
            <button
              onClick={() => handleDaysChange(90)} // 3 months (90 days)
              className="w-[280px] border border-[#87CEEB] text-white px-4 py-2 rounded-md hover:bg-[#87CEEB] hover:text-black transition hover:font-bold"
            >
              3 Months
            </button>
            <button
              onClick={() => handleDaysChange(365)}
              className="w-[280px] border border-[#87CEEB] text-white px-4 py-2 rounded-md hover:bg-[#87CEEB] hover:text-black transition hover:font-bold"
            >
              1 Year
            </button>

          </div>


          {/* ApexChart */}

        </div>
      </div>
    </div>
  );
};

export default Details;
