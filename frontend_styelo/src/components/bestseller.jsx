import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Bestsellers = () => {
  const [book, setBestsellers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/furniture/tag/Bestseller");
        setBestsellers(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-8 py-6">
      <h2 className="text-2xl font-semibold mb-4">Bestsellers</h2>
      <ul className="space-y-2">
        {book.map((item, index) => (
          <li key={index} className="text-lg text-gray-800">
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bestsellers;
