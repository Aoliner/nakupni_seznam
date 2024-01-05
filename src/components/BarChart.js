import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { ThemeContext } from '../App';
import { useTranslation } from 'react-i18next';
import Chart from 'chart.js/auto';

export default function BarChart({ filteredLists }) {
  const { t } = useTranslation(['home']);
  function changeColors(color1, color2) {
    return theme === 'dark' ? color1 : color2;
  }
  const { theme } = useContext(ThemeContext);

  const getChartData = () => {
    if (filteredLists) {
      const listNames = filteredLists.map((list) => list.listName);
      const itemsCount = filteredLists.map((list) => list.items.length);

      return {
        labels: listNames,
        datasets: [
          {
            data: itemsCount,
            backgroundColor: changeColors('#86B6F6', '#38419D'),
          },
        ],
      };
    }
    return null;
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text:  t('Number of Items'),
        color: changeColors('white', 'black'),
        font: function (context) {
            var width = context.chart.width;
            var size = Math.round(width / 16);
            return {
              size: size,
              weight: 600,
            };
          },
      },
      legend: {
          display:false,
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    scales: {
      x: {
        title: {
          color: changeColors('white', 'black'),
          display: true,
        },
        ticks: {
          color: changeColors('white', 'black'),
        },
      },
      y: {
        ticks: {
          stepSize: 1,
          color: changeColors('white', 'black'),
        },
        beginAtZero: true,
        title: {
          color: changeColors('white', 'black'),
          display: true,
        },
      },
    },
  };

  return (
    <div className='barChart'>
      {filteredLists && <Bar data={getChartData()} options={options} />}
    </div>
  );
}
