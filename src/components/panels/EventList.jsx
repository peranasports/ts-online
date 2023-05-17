import React from "react";
import { Portal } from "../utils/Portal";
import PropTypes from "prop-types";
import EventItem from "./EventItem";
import { usePopper } from "react-popper";
import {
  XCircleIcon,
  CheckCircleIcon,
  Bars3Icon,
} from "@heroicons/react/20/solid";

function EventList({ tennisevents, handleItemClicked }) {
  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, { placement:"bottom-start" });

  const handleClicked = (tennisevent) => {
    handleItemClicked(tennisevent);
  };

  const playerInitial = (tennisevent) => {
    if (tennisevent.player.firstName === undefined) {
      return "";
    }
    return tennisevent.player.firstName.length === 0
      ? ""
      : tennisevent.player.firstName.substring(0, 1) + ".";
  };

  const playerLastName = (tennisevent) => {
    return tennisevent.player.lastName !== null
      ? tennisevent.player.lastName.toUpperCase()
      : "";
  };

  return (
    <>
      <div className="rounded-sm shadow-lg bg-base-100">
        <div className="">
          {tennisevents.map((tennisevent, id) => (
            // <EventItem
            //   key={id}
            //   tennisevent={tennisevent}
            //   handleItemClicked={(tennisevent) =>
            //     handleItemClicked(tennisevent)
            //   }
            // />
            <div
              className="mb-2 w-full rounded-sm card-compact bg-base-200 hover:bg-base-300"
              onClick={() => handleClicked(tennisevent)}
            >
              <div className="flex px-1 justify-between">
                <div className="text-sm font-medium">
                  {playerInitial(tennisevent)} {playerLastName(tennisevent)}
                </div>
                <p className="text-right text-xs font-light">
                  [S{tennisevent.setNumber}] {tennisevent.realScores}
                </p>
              </div>
              <div className="max-w-md px-1 flex justify-between">
                <div className="flex">
                  {tennisevent.result === 0 ? (
                    <XCircleIcon
                      className="mt-1 mr-1 h-2 w-2 flex-shrink-0 text-red-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <></>
                  )}
                  {tennisevent.result === 3 ? (
                    <CheckCircleIcon
                      className="mt-1 mr-1 h-2 w-2 flex-shrink-0 text-green-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <></>
                  )}
                  <p className="text-left text-xs font-normal">
                    {tennisevent.eventString}
                  </p>
                </div>
                <div className="relative" ref={setPopperElement}>
                  <Bars3Icon
                    tabIndex={0}
                    className="mr-1 h-4 w-4 flex-shrink-0 cursor-pointer text-info"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Portal>
        <div
          className="absolute z-20 bg-white rounded shadow-lg"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
            <p>Popup Menu</p>
        </div>
      </Portal>
    </>
  );
}

EventList.propTypes = {
  tennisevents: PropTypes.array.isRequired,
};

export default EventList;
