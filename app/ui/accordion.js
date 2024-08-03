import { useState } from 'react';

const Accordion = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleItemClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className="border-b">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => handleItemClick(index)}
          >
            <div className="text-lg font-medium">{item.title}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${activeIndex === index ? 'transform rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {activeIndex === index && (
            <div className="p-4">
              <p className="text-gray-700">{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
