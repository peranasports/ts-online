import { useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import {
  XCircleIcon,
  CheckCircleIcon,
  Bars3Icon,
} from "@heroicons/react/20/solid";

function EventItem({ tennisevent, handleItemClicked }) {
  const {
    id,
    videoTime,
    playerGuid,
    hand,
    skill,
    subskill,
    eventString,
    firstName,
    lastName,
    realScores,
    result,
  } = tennisevent;

  const doEventMenuClicked = () => {};

  const handleClicked = () => {
    handleItemClicked(tennisevent);
  };

  const playerInitial = () => {
    if (tennisevent.player.firstName === undefined) {
      return "";
    }
    return tennisevent.player.firstName.length === 0
      ? ""
      : tennisevent.player.firstName.substring(0, 1) + ".";
  };

  const playerLastName = () => {
    return tennisevent.player.lastName !== null
      ? tennisevent.player.lastName.toUpperCase()
      : "";
  };

  return (
    <>
      <div
        className="mb-2 w-full rounded-sm card-compact bg-base-200 hover:bg-base-300"
        onClick={handleClicked}
      >
        <div className="flex px-1 justify-between">
          <div className="text-sm font-medium">
            {playerInitial()} {playerLastName()}
          </div>
          <p className="text-right text-xs font-light">
            [S{tennisevent.setNumber}] {tennisevent.realScores}
          </p>
        </div>
        <div className="max-w-md px-1 flex justify-between">
          <div className="flex">
            {result === 0 ? (
              <XCircleIcon
                className="mt-1 mr-1 h-2 w-2 flex-shrink-0 text-red-400"
                aria-hidden="true"
              />
            ) : (
              <></>
            )}
            {result === 3 ? (
              <CheckCircleIcon
                className="mt-1 mr-1 h-2 w-2 flex-shrink-0 text-green-400"
                aria-hidden="true"
              />
            ) : (
              <></>
            )}
            <p className="text-left text-xs font-normal">{eventString}</p>
          </div>
          <div className="dropdown dropdown-end">
            <Bars3Icon
              tabIndex={0}
              className="mr-1 h-4 w-4 flex-shrink-0 cursor-pointer text-info"
              aria-hidden="true"
            />
              <ul
                tabIndex={0}
                className="dropdown-content menu p-0 shadow bg-gray-200 rounded w-52"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </>
  );
}

EventItem.propTypes = {
  tennisevent: PropTypes.object.isRequired,
};

export default EventItem;
