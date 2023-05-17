import React from "react";
import ValuesBar from "./ValuesBar";

function ComparisonBars({ stat, onStatClicked }) {
  const valueString = (val) => {
    return val + (stat.isPercent ? "%" : "");
  };

  return (
    <>
      <div className="card card-compact shadow-md rounded-none mt-4 px-3">
        <div className="flex justify-between mb-1">
          <p
            className="text-xs cursor-pointer"
            onClick={() => onStatClicked(stat.events1)}
          >
            {valueString(stat.value1)}
          </p>
          <p className="text-xs font-bold">{stat.label}</p>
          <p
            className="text-xs cursor-pointer"
            onClick={() => onStatClicked(stat.events2)}
          >
            {valueString(stat.value2)}
          </p>
        </div>
        <div className="flex mb-6">
          <ValuesBar stat={stat} />
        </div>
      </div>
    </>
  );
}

export default ComparisonBars;
