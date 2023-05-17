import { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { XCircleIcon } from "@heroicons/react/20/solid";
import HamburgerButton from "../../assets/hamburger_button.png";
import EventItem from "../panels/EventItem";
import ReactPlayer from "react-player";

function FiltersVideo() {
  const location = useLocation();
  const { tennisevents } = location.state;
  const playerRef = useRef();
  const [url, setUrl] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [pendingEvent, setPendingEvent] = useState(null);

  const goToVideoPosition = (videoTime) => {
    // console.log('Match TS', videoTime)
    // console.log('Match TS', match)
    playerRef.current.seekTo(videoTime, "seconds");
  };

  const eventSelected = (tennisevent) => {
    sm: closeEventsList();

    setCurrentEvent(tennisevent);
    // console.log('Playlist.jsx', playItem)
    // console.log('current URL', playerRef.current, playerRef.current.url)
    const newurl = tennisevent.videoFile;
    if (newurl !== url) {
      setPendingEvent(tennisevent);
      setUrl(newurl);
    }
    playerRef.current.seekTo(tennisevent.videoTime - 3, "seconds");
    playerRef.current.playing = true;
  };

  const playerReady = () => {
    if (pendingEvent != null) {
      playerRef.current.seekTo(pendingEvent.videoTime - 3, "seconds");
      setPendingEvent(null);
    }
  };

  const closeEventsList = () => {
    document.getElementById("my-drawer-3").checked = false;
  };

  const showEventsList = () => {
    console.log(location.state);
    document.getElementById("my-drawer-3").checked = true;
  };

  useEffect(() => {
    if (tennisevents && tennisevents.length > 0)
    {
      const tennisevent = tennisevents[0];
      const newurl = tennisevent.videoFile;
      if (newurl !== url) {
        setPendingEvent(tennisevent);
        setUrl(newurl);
      }  
    }
  }, [tennisevents]);

  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="flex flex-col w-full justify-between ml-2">
            <div className="flex w-full pl-2 rounded card-compact bg-base-300 hover:bg-base-300">
              <div className="lg:hidden">
                <img
                  className="mr-2 pt-1"
                  alt=""
                  width={32}
                  src={HamburgerButton}
                  onClick={() => showEventsList()}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex">
                  <div className="flex">
                    {currentEvent === null ? (
                      <></>
                    ) : (
                      <img
                        className="pl-2 w-7 md:w-9"
                        alt=""
                        src={require(`../../assets/flags/${currentEvent.playerCountryCode}.png`)}
                      />
                    )}
                    <p className="pl-2 pt-0 text-sm font-normal md:text-lg">
                      {currentEvent &&
                        currentEvent.player.firstName !== undefined &&
                        currentEvent.player.firstName.toUpperCase()}
                    </p>
                    <p className="px-2 pt-0 text-sm font-bold md:text-lg">
                      {currentEvent &&
                        currentEvent.player.lastName.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <p className="px-2 pt-0 text-sm font-thin md:text-lg">
                    {currentEvent && currentEvent.eventString.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center my-4">
              <ReactPlayer
                ref={playerRef}
                url={url}
                autoPlay={true}
                width="100%"
                height="100%"
                controls={true}
                onReady={() => playerReady()}
              />
            </div>
          </div>
        </div>
        <div className="drawer-side h-full">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <div className="flex-col bg-base-100">
            <div className="flex h-12 justify-end">
              <XCircleIcon className="my-2 w-8 h-8 text-base-900 lg:hidden" onClick={() => closeEventsList()}/>
            </div>
            <div className="overflow-y-auto h-[80vh]">
              {tennisevents !== null
                ? tennisevents.map((tennisevent, i) => (
                    <EventItem
                      key={i}
                      tennisevent={tennisevent}
                      handleItemClicked={(tennisevent) =>
                        eventSelected(tennisevent)
                      }
                    />
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FiltersVideo;
