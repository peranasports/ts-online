import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateStats } from "../components/utils/StatsObject";
import ComparisonBars from "../components/utils/ComparisonBars";

function StatsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { match } = location.state;
  const [statBars, setStatBars] = useState([]);
  const [soPlayer1, setSoPlayer1] = useState(null);
  const [soPlayer2, setSoPlayer2] = useState(null);
  const [cols, setCols] = useState(1)

  const showEvents = (evs) => {
    if (evs !== undefined) {
      navigate("/filtersvideo", { state: { tennisevents: evs } });
    }
  };

  useEffect(() => {
    if (match !== undefined) {
      var idx = 1;
      const ret = updateStats(match, 0);
      setSoPlayer1(ret.statsA);
      setSoPlayer2(ret.statsB);
      var aw1 = [];
      aw1.push(...ret.statsA.acesEvents);
      aw1.push(...ret.statsA.serveWinnersEvents);
      var aw2 = [];
      aw2.push(...ret.statsB.acesEvents);
      aw2.push(...ret.statsB.serveWinnersEvents);
      var fe1 = [];
      fe1.push(...ret.statsA.forehandForcingErrorsEvents);
      fe1.push(...ret.statsA.backhandForcingErrorsEvents);
      var fe2 = [];
      fe2.push(...ret.statsB.forehandForcingErrorsEvents);
      fe2.push(...ret.statsB.backhandForcingErrorsEvents);
      var ue1 = [];
      ue1.push(...ret.statsA.forehandUnforcedErrorsEvents);
      ue1.push(...ret.statsA.backhandUnforcedErrorsEvents);
      var ue2 = [];
      ue2.push(...ret.statsB.forehandUnforcedErrorsEvents);
      ue2.push(...ret.statsB.backhandUnforcedErrorsEvents);
      var w1 = [];
      w1.push(...ret.statsA.totalWinnersEvents);
      var tp1 = ret.statsA.totalWinnersEvents;
      tp1.push(...fe2);
      tp1.push(...ue2);
      var w2 = [];
      w2.push(...ret.statsB.totalWinnersEvents);
      var tp2 = ret.statsB.totalWinnersEvents;
      tp2.push(...fe1);
      tp2.push(...ue1);

      var ss = [
        {
          id: idx++,
          value1:
            tp1.length,
          value2:
            tp2.length,
          label: "Total Points Won",
          events1: tp1.sort((a,b) => a.timestamp > b.timestamp ? 1 : -1),
          events2: tp2.sort((a,b) => a.timestamp > b.timestamp ? 1 : -1),
        },
        {
          id: idx++,
          value1: 0, //ret.statsA.totalPoints,
          value2: 0, //ret.statsB.totalPoints,
          label: "Total Presssure Points Won",
        },
        {
          id: idx++,
          value1: ret.statsA.totalWinners,
          value2: ret.statsB.totalWinners,
          label: "Winners",
          events1: w1,
          events2: w2,
        },
        {
          id: idx++,
          value1:
            ret.statsA.backhandUnforcedErrors +
            ret.statsA.forehandUnforcedErrors,
          value2:
            ret.statsB.backhandUnforcedErrors +
            ret.statsB.forehandUnforcedErrors,
          label: "Unforced Errors",
          events1: ue1,
          events2: ue2,
        },
        {
          id: idx++,
          value1:
            ret.statsA.backhandForcingErrors + ret.statsA.forehandForcingErrors,
          value2:
            ret.statsB.backhandForcingErrors + ret.statsB.forehandForcingErrors,
          label: "Forced Errors",
          events1: fe1,
          events2: fe2,
        },
        {
          id: idx++,
          value1: ret.statsA.aces + ret.statsA.serveWinners,
          value2: ret.statsB.aces + ret.statsB.serveWinners,
          label: "Serve Aces/Winners",
          events1: aw1,
          events2: aw2,
        },
        {
          id: idx++,
          value1: ret.statsA.doublefaults,
          value2: ret.statsB.doublefaults,
          label: "Double Faults",
          events1: ret.statsA.doublefaultsEvents,
          events2: ret.statsB.doublefaultsEvents,
        },
        {
          id: idx++,
          value1: (
            (ret.statsA.firstServeIns * 100) /
            ret.statsA.firstServes
          ).toFixed(0),
          value2: (
            (ret.statsB.firstServeIns * 100) /
            ret.statsB.firstServes
          ).toFixed(0),
          label: "First Serves In",
          isPercent: true,
          events1: ret.statsA.firstServeInsEvents,
          events2: ret.statsB.firstServeInsEvents,
        },
        {
          id: idx++,
          value1: (
            (ret.statsA.firstServicePointsWon * 100) /
            ret.statsA.firstServeIns
          ).toFixed(0),
          value2: (
            (ret.statsB.firstServicePointsWon * 100) /
            ret.statsB.firstServeIns
          ).toFixed(0),
          label: "First Serves Won",
          isPercent: true,
          events1: ret.statsA.firstServicePointsWonRallies,
          events2: ret.statsB.firstServicePointsWonRallies,
        },
        {
          id: idx++,
          value1: (
            (ret.statsA.secondServicePointsWon * 100) /
            ret.statsA.secondServeIns
          ).toFixed(0),
          value2: (
            (ret.statsB.secondServicePointsWon * 100) /
            ret.statsB.secondServeIns
          ).toFixed(0),
          label: "Second Serves Won",
          isPercent: true,
          events1: ret.statsA.secondServicePointsWonRallies,
          events2: ret.statsB.secondServicePointsWonRallies,
        },
        {
          id: idx++,
          value1:
            ret.statsA.returnsFirstServe === 0
              ? 0
              : (
                  (ret.statsA.pointsWonOnReturnOffFirstServes * 100) /
                  ret.statsA.returnsFirstServe
                ).toFixed(0),
          value2:
            ret.statsB.returnsFirstServe === 0
              ? 0
              : (
                  (ret.statsB.pointsWonOnReturnOffFirstServes * 100) /
                  ret.statsB.returnsFirstServe
                ).toFixed(0),
          label: "1st Serve Return Points Won",
          isPercent: true,
          events1: ret.statsA.pointsWonOnReturnOffFirstServesRallies,
          events2: ret.statsB.pointsWonOnReturnOffFirstServesRallies,
        },
        {
          id: idx++,
          value1:
            ret.statsA.returnsSecondServe === 0
              ? 0
              : (
                  (ret.statsA.pointsWonOnReturnOffSecondServes * 100) /
                  ret.statsA.returnsSecondServe
                ).toFixed(0),
          value2:
            ret.statsB.returnsSecondServe === 0
              ? 0
              : (
                  (ret.statsB.pointsWonOnReturnOffSecondServes * 100) /
                  ret.statsB.returnsSecondServe
                ).toFixed(0),
          label: "2nd Serve Return Points Won",
          isPercent: true,
          events1: ret.statsA.pointsWonOnReturnOffSecondServesRallies,
          events2: ret.statsB.pointsWonOnReturnOffSecondServesRallies,
        },
        {
          id: idx++,
          value1: (
            (ret.statsA.breakPointsConverted * 100) /
            ret.statsA.breakPoints
          ).toFixed(0),
          value2: (
            (ret.statsB.breakPointsConverted * 100) /
            ret.statsB.breakPoints
          ).toFixed(0),
          label: "Break Points Won",
          isPercent: true,
          events1: ret.statsA.breakPointsConvertedRallies,
          events2: ret.statsB.breakPointsConvertedRallies,
        },
        {
          id: idx++,
          value1: ret.statsA.totalShortRalliesWon,
          value2: ret.statsB.totalShortRalliesWon,
          label: "Short Rallies (0-4) Won",
          events1: ret.statsA.totalShortRalliesWonRallies,
          events2: ret.statsB.totalShortRalliesWonRallies,
        },
        {
          id: idx++,
          value1: ret.statsA.totalMediumRalliesWon,
          value2: ret.statsB.totalMediumRalliesWon,
          label: "Medium Rallies (0-4) Won",
          events1: ret.statsA.totalMediumRalliesWonRallies,
          events2: ret.statsB.totalMediumRalliesWonRallies,
        },
        {
          id: idx++,
          value1: ret.statsA.totalLongRalliesWon,
          value2: ret.statsB.totalLongRalliesWon,
          label: "Long Rallies (0-4) Won",
          events1: ret.statsA.totalLongRalliesWonRallies,
          events2: ret.statsB.totalLongRalliesWonRallies,
        },
        {
          id: idx++,
          value1: ret.statsA.totalShotsWithin2mOfBaseLine,
          value2: ret.statsB.totalShotsWithin2mOfBaseLine,
          label: "Shots Within 2m of Baseline",
          events1: ret.statsA.totalShotsWithin2mOfBaseLineEvents,
          events2: ret.statsB.totalShotsWithin2mOfBaseLineEvents,
        },
      ];
      setStatBars(ss);
      setCols(Math.ceil(ss.length / 8));
      sm: setCols(1);
    }
  }, [match]);
  return (
    <>
    
      <div className="flex gap-4">
        <div className="flex-col w-[320px]">
          {statBars
            .filter((obj) => obj.id <= (statBars.length + 1) / 2)
            .map((sb, i) => (
              <div className="mt-4">
                <ComparisonBars
                  stat={sb}
                  onStatClicked={(evs) => showEvents(evs)}
                  key={i}
                />
              </div>
            ))}
        </div>
        <div className="flex-col w-[320px]">
          {statBars
            .filter((obj) => obj.id > (statBars.length + 1) / 2)
            .map((sb, i) => (
              <div className="mt-4">
                <ComparisonBars
                  stat={sb}
                  onStatClicked={(evs) => showEvents(evs)}
                  key={i}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default StatsPage;
