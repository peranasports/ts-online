import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { importPSTS } from "../components/utils/pstsFile";
import HamburgerButton from "../assets/hamburger_button.png";
import { XCircleIcon, Bars3Icon } from "@heroicons/react/20/solid";
import SetList from "../components/panels/SetList";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";

function Match() {
  const navigate = useNavigate();
  const location = useLocation();
  const { matchId, pstsFileData } = location.state;
  const [match, setMatch] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSet, setSelectedSet] = useState(0)
  const playerRef = useRef();
  const [videoUrl, setVideoUrl] = useState(null);

  const showEventsList = () => {
    document.getElementById("my-drawer-3").checked = true;
  };

  const closeEventsList = () => {
    document.getElementById("my-drawer-3").checked = false;
  };

  const playerReady = () => {
    // if (pendingPlayItem != null) {
    //   playerRef.current.seekTo(pendingPlayItem.startLocation, "seconds");
    //   setPendingPlayItem(null)
    // }
  };

  const goToVideoPosition = (tennisevent) => {
    setSelectedEvent(tennisevent);
    if (match.videoOffset === undefined) {
      toast.error("Please synchronise events with video.");
      return;
    }
    playerRef.current.seekTo(
      tennisevent.timestamp - match.videoOffset - 3,
      "seconds"
    );
  };

  const doFilters = () => {
    const st = {
      matches: [match],
      playerGuid: match.player1Guid,
    };
    navigate("/filters", { state: st });
  };

  const doStats = () => {
    const st = {
      match: match,
    };
    navigate("/statspage", { state: st });
  };

  const doSynch = () => {
    if (selectedEvent === null) {
      toast.error("Please select an event to synch with video!");
      return;
    }

    const currentEventTime = selectedEvent.timestamp;
    const voffset = playerRef.current.getCurrentTime();
    match.videoOffset = currentEventTime - voffset;

    for (var sm of match.sets) {
      for (var e of sm.events) {
        e.videoTime = e.timestamp - match.videoOffset;
      }
    }
  };

  useEffect(() => {
    if (pstsFileData !== null) {
      const m = importPSTS(pstsFileData);
      setMatch(m);
      setVideoUrl(m.videoFile);
    }
  }, [pstsFileData]);

  if (match === null) {
    return <></>;
  }

  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content w-full">
          <div className="flex gap-2 my-2 justify-between">
            <div className="flex gap-2">
              <div className="lg:hidden">
                <Bars3Icon
                  className="w-8 h-8 text-base-900 sm:hidden"
                  onClick={() => showEventsList()}
                />
              </div>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => doFilters()}
              >
                Filters
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => doStats()}
              >
                Stats
              </button>
            </div>
            <div className="">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => doSynch()}
              >
                Synch Video
              </button>
            </div>
          </div>
          <div className="flex flex-col w-full justify-between">
            <div className="flex w-full pl-2 rounded-lg card-compact bg-base-300 hover:bg-base-300">
              <div className="flex flex-col">
                <div className="flex">
                  <div>
                    {match.player1CountryCode !== null ? (
                      <img
                        className="pl-2 w-7 md:w-9"
                        alt=""
                        src={require(`../assets/flags/${match.player1CountryCode}.png`)}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex">
                    <p className="pl-2 pt-0 text-sm font-normal md:text-lg">
                      {match.player1FirstName !== null
                        ? match.player1FirstName.toUpperCase()
                        : null}
                    </p>
                    <p className="px-2 pt-0 text-sm font-bold md:text-lg">
                      {match.player1LastName !== null
                        ? match.player1LastName.toUpperCase()
                        : null}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div>
                    {match.player2CountryCode !== null ? (
                      <img
                        className="pl-2 w-7 md:w-9"
                        alt=""
                        src={require(`../assets/flags/${match.player2CountryCode}.png`)}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex">
                    <p className="pl-2 pt-0 text-sm font-normal md:text-lg">
                      {match.player2FirstName !== null
                        ? match.player2FirstName.toUpperCase()
                        : null}
                    </p>
                    <p className="px-2 pt-0 text-sm font-bold md:text-lg">
                      {match.player2LastName !== null
                        ? match.player2LastName.toUpperCase()
                        : null}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center my-4">
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={true}
                width="120%"
                height="120%"
                controls={true}
                onReady={() => playerReady()}
              />
            </div>
          </div>
        </div>
        <div className="drawer-side h-[70vh]">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <div className="flex-col w-80">
            <div className="flex justify-between bg-base-200">
              <div className="flex">
                {/* {match.sets.map((st, i) => (
                  <button className="btn btn-sm m-2" key={i} onClick={() => setSelectedSet(i + 1)}>
                    S{i + 1}
                  </button>
                ))} */}
              </div>
              <XCircleIcon
                className="m-2 w-8 h-8 text-base-900 sm:hidden"
                onClick={() => closeEventsList()}
              />
            </div>
            <div className="overflow-y-auto h-[100vh]">
              <SetList
                sets={match.sets}
                selectedSet={selectedSet}
                handleItemClicked={(tennisevent) =>
                  goToVideoPosition(tennisevent)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Match;
