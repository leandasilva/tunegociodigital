import React, { ReactNode } from "react";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark relative">
      <div className="absolute top-0 left-0 right-0 flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>

      <div className="flex flex-col items-center justify-center h-full">
        <h4 className="text-title-md font-bold text-black dark:text-white mb-2 text-center">
          {total}
        </h4>
        <span className="text-sm font-medium">{title}</span>
      </div>
    </div>
  );
};

export default CardDataStats;

