import { useEffect, useContext, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/layout/Spinner";
import TennisCourt from "../components/filters/TennisCourt";
import AllFiltersPanel from "../components/filters/AllFiltersPanel";
import { allFilters } from "../components/filters/AllFilters";
import {
  ArrowsUpDownIcon,
  ArrowUpIcon,
  ArrowPathIcon,
  PlayCircleIcon,
  FunnelIcon,
  ListBulletIcon,
  Bars3Icon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import HamburgerButton from "../assets/hamburger_button.png";

function FiltersAnalysis() {
  const location = useLocation();
  const { matches, playerGuid } = location.state;
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [, forceUpdate] = useState(0);
  const [allOptions, setAllOptions] = useState(allFilters);
  const [displayMode, setDisplayMode] = useState(0);
  const [isNormalised, setIsNormalised] = useState(false);
  const [showSource, setShowSource] = useState(false);

  const doUpdateAllOptions = (updatedAllOptions) => {
    setAllOptions(updatedAllOptions);
    console.log("updated allOptions", allOptions);
  };

  const doUpdate = () => {
    forceUpdate((n) => !n);
  };

  const closeFilters = () => {
    document.getElementById("my-drawer-5").checked = false;
  };

  const showFilters = () => {
    console.log(location.state);
    document.getElementById("my-drawer-5").checked = true;
  };

  useEffect(() => {}, [matches]);

  if (loading) {
    return <Spinner />;
  }

  const handleFilteredEventsChanged = (filteredevents) => {
    setSelectedEvents(filteredevents);
  };

  const doFiltersVideo = (tennisevents) => {
    navigate("/filtersvideo", { state: { tennisevents: tennisevents } });
  };

  const doDisplayMode = (dm) => {
    setDisplayMode(dm);
    // forceUpdate(n => !n)
  };

  const toggleFilters = () => {
    document.getElementById("my-drawer-5").checked =
      !document.getElementById("my-drawer-5").checked;
  };

  const toggleNormalise = () => {
    var n = isNormalised;
    n = !n;
    setIsNormalised(n);
  };

  const toggleShowSource = () => {
    var n = showSource;
    n = !n;
    setShowSource(n);
  };

  if (matches === null) {
    return <></>;
  }

  return (
    <div>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="flex justify-between">
            <label
              className="btn bg-base-100 border-0"
              onClick={() => toggleFilters()}
            >
              <Bars3Icon
                className="w-8 h-8 text-gray-400"
                aria-hidden="true"
              />
            </label>
            <div className="flex space-x-2 justify-end bg-base-100">
              <label
                className="btn bg-base-100 border-0"
                onClick={() => toggleNormalise()}
              >
                {isNormalised ? (
                  <ArrowsUpDownIcon
                    className="w-8 h-8 text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowUpIcon
                    className="w-8 h-8 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </label>
              <label
                className="btn bg-base-100 border-0"
                onClick={() => toggleShowSource()}
              >
                <ArrowPathIcon
                  className="w-8 h-8 text-gray-400"
                  aria-hidden="true"
                />
              </label>
              <div
                className="dropdown tooltip tooltip-bottom"
                data-tip="Display Type"
              >
                <label tabIndex={0} className="btn bg-base-100 border-0">
                  <ListBulletIcon
                    className="w-8 h-8 text-gray-400"
                    aria-hidden="true"
                  />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li onClick={() => doDisplayMode(0)}>
                    <a>Ball Path</a>
                  </li>
                  <li onClick={() => doDisplayMode(1)}>
                    <a>Heatmap</a>
                  </li>
                  <li onClick={() => doDisplayMode(2)}>
                    <a>Zone Count</a>
                  </li>
                  <li onClick={() => doDisplayMode(3)}>
                    <a>Zone Percent</a>
                  </li>
                </ul>
              </div>
              <label
                className="btn bg-base-100 border-0"
                onClick={() => doFiltersVideo(selectedEvents)}
              >
                <PlayCircleIcon
                  className="w-8 h-8 text-gray-400"
                  aria-hidden="true"
                />
              </label>
            </div>
          </div>
          {/* <label htmlFor="my-drawer-5" className="flex justify-end btn drawer-button lg:hidden">Toggle Filters</label> */}
          <div className="h-full bg-blue-500">
            <TennisCourt
              sets={matches[0].sets}
              allOptions={allOptions}
              matches={matches}
              playerGuid={matches[0].player1Guid}
              oppositionId={
                matches.length === 1
                  ? matches[0].player1Guid === playerGuid
                    ? matches[0].player2Guid
                    : matches[0].player1Guid
                  : 0
              }
              displayMode={displayMode}
              isNormalised={isNormalised}
              showSource={showSource}
              handleFilteredEventsChanged={(filteredevents) =>
                handleFilteredEventsChanged(filteredevents)
              }
            />
          </div>
        </div>
        <div className="drawer-side w-80">
          <label htmlFor="my-drawer-5" className="drawer-overlay"></label>
          <div className="flex-col">
            <div className="flex justify-end bg-base-100">
              <XCircleIcon
                className="m-2 w-8 h-8 text-base-900"
                onClick={() => closeFilters()}
              />
            </div>
            <div className="h-full bg-base-200">
              <AllFiltersPanel
                allOptions={allOptions}
                matches={matches}
                playerGuid={matches[0].player1Guid}
                handleFilterOptionChanged={() => doUpdate()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiltersAnalysis;
