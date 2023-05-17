import { useEffect } from "react";
import PropTypes from "prop-types";
import SetItem from "./SetItem";

function SetList({ sets, selectedSet, handleItemClicked }) {
  // console.log('SetList sets', sets)

  useEffect(() => {
    const elem = document.activeElement;
    if (elem) {
      elem?.blur();
    }
    const element = document.getElementById(selectedSet);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [selectedSet]);

  return (
    <div className="rounded shadow-lg bg-base-100">
      <div className="">
        {sets.map((set, id) => (
          <div
            key={id}
            tabIndex={id}
            className="collapse collapse-arrow border border-base-300 bg-base-100 rounded"
          >
            <input type="checkbox" className="peer" />
            <div className="collapse-title">
              <div className="flex justify-between">
                <p>Set {id + 1}</p>
                <p>
                  {set.playerScore} - {set.oppositionScore}
                </p>
              </div>
            </div>
            <div className="collapse-content" id={set.number}>
              <SetItem
                key={id}
                set={set}
                handleItemClicked={(tennisevent) =>
                  handleItemClicked(tennisevent)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

SetList.propTypes = {
  sets: PropTypes.array.isRequired,
};

export default SetList;
