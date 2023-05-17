import { stringToPoint } from "./utils";
import {
  kRallyPointWon,
  kRally,
  kKeypoint,
  kRallyServeVolley,
  kServeOutOffNet,
  kReturnPassingShot,
  kRallyOutcomeWinner,
  kRallyOutcomePassingShot,
  kRallyOutcomePutAway,
  kRallyOutcomeForcingError,
  kRallyOutcomeNettedPassingShot,
  kRallyOutcomeOutPassingShot,
  kRallyPointServeAndVolley,
  kRallyPointNetApproach,
  kRallyBreakpoint,
  kRallyBreakpointConverted,
  kRallyPointWonOnFirstServe,
  kRallyServeAceWinner,
  kForehand,
  kBackhand,
  kServeAce,
  kServing,
  kReturning,
  kServeFirst,
  kServeSecond,
  kServeLet,
  kServeOut,
  kServeNet,
  kServeFootfault,
  kServeWinner,
  kReturnWinner,
  kReturnOut,
  kReturnNetted,
  kRallyOutcomeOut,
  kRallyOutcomeNetted,
  kReturnUnforcedError,
  kReturnForcingError,
  kRallyServeFirst,
  kRallyServeSecond,
  kRallyServeFirstIn,
  kRallyServeSecondIn,
  kRallyServeDoubleFault,
  kRallyPointWonOnSecondServe,
  kRallyPointWonOnReceiveFirstServe,
  kRallyPointWonOnReceiveSecondServe,
  kRallyOutcomeUnforcedError,
  kRallyKeypointForcingError,
  kRallyKeypointWinner,
  kRallyPointWonOnReceive,
  kRallyKeypointUnforcedError,
  kRallyReturnForcingError,
  kRallyReturnWinner,
  kRallyReturnUnforcedError,
  kReturnFirst,
  kServeIn,
} from "./pstsDefines.js";

var selectedStatsSet = 0;
var soPlayer = null;
var soOpposition = null;
var dicRallies = null;
var events = null;
var rallies = null;
var soPlayer = {};
var soOpposition = {};
var worktime = 0;

export function updateStats(match, selset) {
  var rs = getRalliesInMatch(match);
  var startd = new Date();

  selectedStatsSet = selset;
  soPlayer = initStatsObject();
  soOpposition = initStatsObject();
  dicRallies = null;
  events = null;
  rallies = null;
  if (match.isDoubles) {
    soPlayer.player = match.teamA.player1;
    soOpposition.player = match.teamB.player1;
    soPlayer.team = match.teamA;
    soOpposition.team = match.teamB;
  } else {
    soPlayer.player = match.player1;
    soOpposition.player = match.player2;
  }
  var playtime = 0;
  var starttime = -1;
  var endtime = -1;

  dicRallies = {};
  events = [];
  rallies = [];
  var lastRally = null;
  for (var r of rs) {
    if (selectedStatsSet !== 0 && r.setNumber !== selectedStatsSet) {
      continue;
    }

    var rlen = 0;
    for (ev of r.events) {
      if (ev.skill === kServing) continue;
      if (ev.skill !== kReturning) {
        rlen++;
      }
    }
    r.rallyLength = rlen;

    if (starttime === -1 && r.startTime !== -1) {
      starttime = r.startTime;
    }
    endtime = r.endTime;
    playtime += r.endTime - r.startTime;
    rallies.push(r);
    r.keyPlEvents = [];
    r.keyOpEvents = [];
    var firstRally = true;
    if (r.events.length > 0) {
      var lev1 = lastRally === null ? null : lastRally.events[0];
      var ev1 = r.events[0];
      if (
        lev1 !== null &&
        lev1.playerGameScore === ev1.playerGameScore &&
        lev1.oppositionGameScore === ev1.oppositionGameScore &&
        lev1.playerSetScore === ev1.playerSetScore &&
        lev1.oppositionSetScore === ev1.oppositionSetScore
      ) {
        var hgs = ev1.playerGameScore;
        var ags = ev1.oppositionGameScore;
        if (r.isDoubles) {
          if (lastRally.teamwinner === match.teamA) {
            hgs++;
          } else {
            ags++;
          }
        } else {
          if (
            lastRally.winner === match.player1 ||
            lastRally.teamwinner === match.teamA
          ) {
            hgs++;
          } else {
            ags++;
          }
        }
        var scores =
          ev1.playerSetScore +
          ":" +
          ev1.oppositionSetScore +
          " " +
          hgs +
          ":" +
          ags;
      }
      var ev = r.events[0];
      var str = "Set " + ev.setNumber + " " + ev.scores;
      dicRallies[str] = r;

      if (r.isDoubles) {
        if (r.teamwinner === soPlayer.team) {
          // match.player1)
          r.keyPlEvents.push(kRallyPointWon);
          soPlayer.totalPointsWon++;
          soPlayer.totalPointsWonRallies.push(r.evemts[0]);
          if (r.rallyLength > 8) {
            soPlayer.totalLongRalliesWon++;
            soPlayer.totalLongRalliesWonRallies.push(r.events[0]);
          } else if (r.rallyLength > 4) {
            soPlayer.totalMediumRalliesWon++;
            soPlayer.totalMediumRalliesWonRallies.push(r.events[0]);
          } else {
            soPlayer.totalShortRalliesWon++;
            soPlayer.totalShortRalliesWonRallies.push(r.events[0]);
          }
        } else if (r.teamwinner === soOpposition.team) {
          // match.player2)
          r.keyOpEvents.push(kRallyPointWon);
          soOpposition.totalPointsWon++;
          soOpposition.totalPointsWonRallies.push(r.evemts[0]);
          if (r.rallyLength > 8) {
            soOpposition.totalLongRalliesWon++;
            soOpposition.totalLongRalliesWonRallies.push(r.events[0]);
          } else if (r.rallyLength > 4) {
            soOpposition.totalMediumRalliesWon++;
            soOpposition.totalMediumRalliesWonRallies.push(r.events[0]);
          } else {
            soOpposition.totalShortRalliesWon++;
            soOpposition.totalShortRalliesWonRallies.push(r.events[0]);
          }
        }
      } else {
        if (r.isDoubles) {
          if (r.teamwinner === soPlayer.team) {
            // match.player1)
            r.keyPlEvents.push(kRallyPointWon);
            soPlayer.totalPointsWon++;
            soPlayer.totalPointsWonRallies.push(r.evemts[0]);
            if (r.rallyLength > 8) {
              soPlayer.totalLongRalliesWon++;
              soPlayer.totalLongRalliesWonRallies.push(r.events[0]);
            } else if (r.rallyLength > 4) {
              soPlayer.totalMediumRalliesWon++;
              soPlayer.totalMediumRalliesWonRallies.push(r.events[0]);
            } else {
              soPlayer.totalShortRalliesWon++;
              soPlayer.totalShortRalliesWonRallies.push(r.events[0]);
            }
          } else if (r.teamwinner === soOpposition.team) {
            // match.player2)
            r.keyOpEvents.push(kRallyPointWon);
            soOpposition.totalPointsWon++;
            soOpposition.totalPointsWonRallies.push(r.evemts[0]);
            if (r.rallyLength > 8) {
              soOpposition.totalLongRalliesWon++;
              soOpposition.totalLongRalliesWonRallies.push(r.events[0]);
            } else if (r.rallyLength > 4) {
              soOpposition.totalMediumRalliesWon++;
              soOpposition.totalMediumRalliesWonRallies.push(r.events[0]);
            } else {
              soOpposition.totalShortRalliesWon++;
              soOpposition.totalShortRalliesWonRallies.push(r.events[0]);
            }
          }
        } else {
          if (r.winner === soPlayer.player) {
            // match.player1)
            r.keyPlEvents.push(kRallyPointWon);
            soPlayer.totalPointsWon++;
            soPlayer.totalPointsWonRallies.push(r.events[0]);
            if (r.rallyLength > 8) {
              soPlayer.totalLongRalliesWon++;
              soPlayer.totalLongRalliesWonRallies.push(r.events[0]);
            } else if (r.rallyLength > 4) {
              soPlayer.totalMediumRalliesWon++;
              soPlayer.totalMediumRalliesWonRallies.push(r.events[0]);
            } else {
              soPlayer.totalShortRalliesWon++;
              soPlayer.totalShortRalliesWonRallies.push(r.events[0]);
            }
          } else if (r.winner === soOpposition.player) {
            // match.player2)
            r.keyOpEvents.push(kRallyPointWon);
            soOpposition.totalPointsWon++;
            soOpposition.totalPointsWonRallies.push(r.events[0]);
            if (r.rallyLength > 8) {
              soOpposition.totalLongRalliesWon++;
              soOpposition.totalLongRalliesWonRallies.push(r.events[0]);
            } else if (r.rallyLength > 4) {
              soOpposition.totalMediumRalliesWon++;
              soOpposition.totalMediumRalliesWonRallies.push(r.events[0]);
            } else {
              soOpposition.totalShortRalliesWon++;
              soOpposition.totalShortRalliesWonRallies.push(r.events[0]);
            }
          }
        }
      }

      for (var e of r.events) {
        if (
          firstRally &&
          (e.skill === kRally || e.skill === kKeypoint) &&
          e.subskill2 === kRallyServeVolley
        ) {
          if (e.player === soPlayer.player) {
            // match.player1)
            r.keyPlEvents.push(kRallyPointServeAndVolley);
            soPlayer.serveAndVolleys++;
            if (e.result === 3) {
              soPlayer.serveAndVolleyWins++;
            }
          } else {
            r.keyOpEvents.push(kRallyPointServeAndVolley);
            soOpposition.serveAndVolleys++;
            if (e.result === 3) {
              soOpposition.serveAndVolleyWins++;
            }
          }
        }
        if (e.skill === kRally || e.skill === kKeypoint) {
          firstRally = false;
          var isNormalised = true;

          var ptstart = stringToPoint(e.startBall);
          var pt = stringToPoint(e.endBall);
          if (pt.x !== 0 || pt.y !== 0) {
            if (isNormalised && ptstart.y < 100) {
              pt.x = 100 - pt.x;
              pt.y = 200 - pt.y;
              ptstart.x = 100 - ptstart.x;
              ptstart.y = 200 - ptstart.y;
            }

            if (ptstart.y < 154) {
              if (e.player === soPlayer.player) {
                // match.player1)
                r.keyPlEvents.push(kRallyPointNetApproach);
                soPlayer.atNets++;
                if (e.result === 3) {
                  soPlayer.pointsWonAtNet++;
                }
              } else {
                r.keyOpEvents.push(kRallyPointNetApproach);
                soOpposition.atNets++;
                if (e.result === 3) {
                  soOpposition.pointsWonAtNet++;
                }
              }
              //                            NSLog(@"from %f, %f to %f, %f", ptstart.x, ptstart.y, pt.x, pt.y);
            }
          }
        }

        events.push(e);
      }
    }

    if (isPlayerBreakpoint(r, match)) {
      r.keyPlEvents.push(kRallyBreakpoint);
      soPlayer.breakPoints++;
      soPlayer.breakPointsEvents.push(e);
      if (r.isDoubles) {
        if (r.teamwinner === soPlayer.team) {
          // match.player1)
          r.keyPlEvents.push(kRallyBreakpointConverted);
          soPlayer.breakPointsConverted++;
          soPlayer.breakPointsConvertedRallies.push(r.events[0]);
        }
      } else {
        if (r.winner === soPlayer.player) {
          // match.player1)
          r.keyPlEvents.push(kRallyBreakpointConverted);
          soPlayer.breakPointsConverted++;
          soPlayer.breakPointsConvertedRallies.push(r.events[0]);
        }
      }
    } else if (isOppositionBreakpoint(r, match)) {
      r.keyOpEvents.push(kRallyBreakpoint);
      soOpposition.breakPoints++;
      soOpposition.breakPointsEvents.push(e);
      if (r.isDoubles) {
        if (r.teamwinner === soOpposition.team) {
          // match.player2)
          r.keyOpEvents.push(kRallyBreakpointConverted);
          soOpposition.breakPointsConverted++;
          soOpposition.breakPointsConvertedRallies.push(r.events[0]);
        }
      } else {
        if (r.winner === soOpposition.player) {
          // match.player2)
          r.keyOpEvents.push(kRallyBreakpointConverted);
          soOpposition.breakPointsConverted++;
          soOpposition.breakPointsConvertedRallies.push(r.events[0]);
        }
      }
    }

    lastRally = r;
  }

  if (starttime === -1) {
    //        NSLog(@"Not available");
    worktime = -1;
  } else {
    var alltime = endtime - starttime;
    worktime = (playtime * 100) / alltime;
    //        NSLog(@"worktime = %f totaltime=%f percentage=%f", playtime, alltime, (playtime * 100)/alltime);
  }
  return calculateStats();
}

function calculateStats() {
  var isFirstServing = true;
  var nextevent = null;
  var n = 0;
  for (var e of events) {
    if (n + 1 < events.length) {
      nextevent = events[n + 1];
    }
    var str = "Set " + e.setNumber + " " + e.scores;
    var r = dicRallies[str];
    if (r === undefined) {
      console.log("undefined r at " + str);
      continue;
    }

    var isplayer = e.player === soPlayer.player; // r.match.player1;
    var so = isplayer ? soPlayer : soOpposition;
    var sko = isplayer ? r.keyPlEvents : r.keyOpEvents;
    var skill = e.skill;
    var subskill1 = e.subskill1;
    var hand = e.hand;
    var result = e.result;
    var outcome = e.outcome;
    var eballspeed = e.ballSpeed;
    var espinrate = e.ballSpinRPM;
    var netxheight = e.netCrossHeight;
    var isTopspin = espinrate >= 0;
    var edistancetravelled = isplayer
      ? e.ballPlayer1Distance
      : e.ballPlayer2Distance;
    so.distanceCovered += edistancetravelled;

    if (skill === kServing) {
      so.totalServes++;
      if (subskill1 === kServeFirst) {
        if (outcome === kServeLet) {
          so.totalServes--;
        } else {
          isFirstServing = true;
          sko.push(kRallyServeFirst);
          so.firstServes++;
          if (result === 0) {
            so.firstServeFaults++;
          } else {
            so.maxSpeedFirstServe = Math.max(eballspeed, so.maxSpeedFirstServe);
            so.totalSpeedFirstServe += eballspeed;
            so.firstServeIns++;
            so.firstServeInsEvents.push(e);
            if (nextevent.skill === kReturning) {
              if (nextevent.result !== 0) {
                so.firstServesReturned++;
                so.firstServesReturnedEvents.push(e);
              }
            }
            //                        NSLog(@"%@ %@", e.scores, e.result);
            sko.push(kRallyServeFirstIn);
            if (r.isDoubles) {
              if (r !== null && isplayer && r.teamwinner === soPlayer.team) {
                // r.match.player1)
                r.keyPlEvents.push(kRallyPointWonOnFirstServe);
                soPlayer.firstServicePointsWon++;
                soPlayer.firstServicePointsWonRallies.push(r.events[0]);
              } else if (
                r !== null &&
                !isplayer &&
                r.teamwinner === soOpposition.team
              ) {
                // r.match.player2)
                r.keyOpEvents.push(kRallyPointWonOnFirstServe);
                soOpposition.firstServicePointsWon++;
                soOpposition.firstServicePointsWonRallies.push(r.events[0]);
              }
            } else {
              if (r !== null && isplayer && r.winner === soPlayer.player) {
                // r.match.player1)
                r.keyPlEvents.push(kRallyPointWonOnFirstServe);
                soPlayer.firstServicePointsWon++;
                soPlayer.firstServicePointsWonRallies.push(r.events[0]);
              } else if (
                r !== null &&
                !isplayer &&
                r.winner === soOpposition.player
              ) {
                // r.match.player2)
                r.keyOpEvents.push(kRallyPointWonOnFirstServe);
                soOpposition.firstServicePointsWon++;
                soOpposition.firstServicePointsWonRallies.push(r.events[0]);
              }
            }
            if (result === 3) {
              sko.push(kRallyServeAceWinner);
              so.firstServeAces++;
              if (outcome === kServeAce) {
                so.aces++;
                so.acesEvents.push(e);
                so.totalWinners++;
                so.totalWinnersEvents.push(e);
              } else if (outcome === kServeWinner) {
                so.serveWinners++;
                so.serveWinnersEvents.push(e);
                so.totalWinners++;
                so.totalWinnersEvents.push(e);
              }
            }
          }
        }
      } else if (subskill1 === kServeSecond) {
        if (outcome === kServeLet) {
          so.totalServes--;
        } else {
          so.maxSpeedSecondServe = Math.max(eballspeed, so.maxSpeedSecondServe);
          so.totalSpeedSecondServe += eballspeed;
          so.secondServeIns++;
          isFirstServing = false;
          sko.push(kRallyServeSecond);
          so.secondServes++;
          if (result === 0) {
            sko.push(kRallyServeDoubleFault);
            so.doublefaults++;
            so.doublefaultsEvents.push(e);
          } else {
            if (nextevent.skill === kReturning) {
              if (nextevent.result !== 0) {
                so.secondServesReturned++;
              }
            }
            sko.push(kRallyServeSecondIn);
            if (r.isDoubles) {
              if (r !== null && isplayer && r.teamwinner === soPlayer.team) {
                // r.match.player1)
                r.keyPlEvents.push(kRallyPointWonOnSecondServe);
                soPlayer.secondServicePointsWon++;
                soPlayer.secondServicePointsWonRallies.push(r.events[0]);
              } else if (
                r !== null &&
                !isplayer &&
                r.teamwinner === soOpposition.team
              ) {
                //r.match.player2)
                r.keyOpEvents.push(kRallyPointWonOnSecondServe);
                soOpposition.secondServicePointsWon++;
                soOpposition.secondServicePointsWonRallies.push(r.events[0]);
              }
            } else {
              if (r !== null && isplayer && r.winner === soPlayer.player) {
                // r.match.player1)
                r.keyPlEvents.push(kRallyPointWonOnSecondServe);
                soPlayer.secondServicePointsWon++;
                soPlayer.secondServicePointsWonRallies.push(r.events[0]);
              } else if (
                r !== null &&
                !isplayer &&
                r.winner === soOpposition.player
              ) {
                //r.match.player2)
                r.keyOpEvents.push(kRallyPointWonOnSecondServe);
                soOpposition.secondServicePointsWon++;
                soOpposition.secondServicePointsWonRallies.push(r.events[0]);
              }
            }
            if (result === 3) {
              sko.push(kRallyServeAceWinner);
              so.secondServeAces++;
              if (outcome === kServeAce) {
                so.aces++;
                so.acesEvents.push(e);
              } else if (outcome === kServeWinner) {
                so.serveWinners++;
                so.serveWinnersEvents.push(e);
                so.totalWinners++;
                so.totalWinnersEvents.push(e);
              }
            }
          }
        }
      }
    } else if (skill === kReturning) {
      if (isplayer) soPlayer.totalReturns++;
      else soOpposition.totalReturns++;
      if (outcome === kReturnUnforcedError) {
        //                NSLog(@"FH outcome = %d skill = %d %@", outcome, skill, e.player.lastName);
        sko.push(kRallyReturnUnforcedError);
        if (hand === kForehand) so.forehandReturnErrors++;
        else so.backhandReturnErrors++;
      } else if (outcome === kReturnForcingError) {
        //                NSLog(@"FH outcome = %d skill = %d %@", outcome, skill, e.player.lastName);
        sko.push(kRallyReturnForcingError);
        if (hand === kForehand) so.forehandReturnErrors++;
        else so.backhandReturnErrors++;
      } else if (outcome === kReturnWinner || outcome === kReturnPassingShot) {
        sko.push(kRallyReturnWinner);
        if (hand === kForehand) {
          so.returnForehandWinners++;
          so.returnForehandWinnersEvents.push(e);
          so.totalWinners++;
          so.totalWinnersEvents.push(e);
        } else {
          so.returnBackhandWinners++;
          so.returnBackhandWinnersEvents.push(e);
          so.totalWinners++;
          so.totalWinnersEvents.push(e);
        }
      } else {
        if (result === 0) {
          //                    NSLog(@"FH outcome = %d skill = %d %@", outcome, skill, e.player.lastName);
          sko.push(kRallyReturnUnforcedError);
          if (hand === kForehand) so.forehandReturnErrors++;
          else so.backhandReturnErrors++;
        }
      }
      if (e.subskill1 === kReturnFirst) {
        so.returnsFirstServe++;
        if (hand === kForehand) {
          so.maxSpeedFirstReturnFH = Math.max(
            eballspeed,
            so.maxSpeedFirstReturnFH
          );
          so.totalSpeedFirstReturnFH += eballspeed;
          so.totalSpinrateTopFirstReturnFH += isTopspin ? espinrate : 0;
          so.returnsFirstServeTopFHs += isTopspin ? 1 : 0;
          so.totalSpinrateBackFirstReturnFH += isTopspin ? 0 : espinrate;
          so.returnsFirstServeBackFHs += isTopspin ? 0 : 1;
        } else {
          so.maxSpeedFirstReturnBH = Math.max(
            eballspeed,
            so.maxSpeedFirstReturnBH
          );
          so.totalSpeedFirstReturnBH += eballspeed;
          so.totalSpinrateTopFirstReturnBH += isTopspin ? espinrate : 0;
          so.returnsFirstServeTopBHs += isTopspin ? 1 : 0;
          so.totalSpinrateBackFirstReturnBH += isTopspin ? 0 : espinrate;
          so.returnsFirstServeBackBHs += isTopspin ? 0 : 1;
        }
      } else {
        so.returnsSecondServe++;
        if (hand === kForehand) {
          so.maxSpeedSecondReturnFH = Math.max(
            eballspeed,
            so.maxSpeedSecondReturnFH
          );
          so.totalSpeedSecondReturnFH += eballspeed;
          so.totalSpinrateTopSecondReturnFH += isTopspin ? espinrate : 0;
          so.returnsSecondServeTopFHs += isTopspin ? 1 : 0;
          so.totalSpinrateBackSecondReturnFH += isTopspin ? 0 : espinrate;
          so.returnsSecondServeBackFHs += isTopspin ? 0 : 1;
        } else {
          so.maxSpeedSecondReturnBH = Math.max(
            eballspeed,
            so.maxSpeedSecondReturnBH
          );
          so.totalSpeedSecondReturnBH += eballspeed;
          so.totalSpinrateTopSecondReturnBH += isTopspin ? espinrate : 0;
          so.returnsSecondServeTopBHs += isTopspin ? 1 : 0;
          so.totalSpinrateBackSecondReturnBH += isTopspin ? 0 : espinrate;
          so.returnsSecondServeBackBHs += isTopspin ? 0 : 1;
        }
      }
      if (hand === kForehand) {
        if (result === 3) {
          so.returnsWinnerFH++;
          so.totalReturnNetXHeightWinnerFH += netxheight;
        } else if (result !== 0) {
          so.returnsInFH++;
          so.totalReturnNetXHeightFH += netxheight;
        }
      } else if (hand === kBackhand) {
        if (result === 3) {
          so.returnsWinnerBH++;
          so.totalReturnNetXHeightWinnerBH += netxheight;
        } else if (result !== 0) {
          so.returnsInBH++;
          so.totalReturnNetXHeightBH += netxheight;
        }
      }
      if (
        r !== null &&
        (r.winner === e.player ||
          (r.teamwinner !== undefined &&
            r.teamwinner.players.includes(e.player)))
      ) {
        sko.push(kRallyPointWonOnReceive);
        if (isplayer) {
          if (isFirstServing) {
            sko.push(kRallyPointWonOnReceiveFirstServe);
            soPlayer.pointsWonOnReturnOffFirstServes++;
            soPlayer.pointsWonOnReturnOffFirstServesRallies.push(r.events[0]);
          } else {
            sko.push(kRallyPointWonOnReceiveSecondServe);
            soPlayer.pointsWonOnReturnOffSecondServes++;
            soPlayer.pointsWonOnReturnOffSecondServesRallies.push(r.events[0]);
          }
          soPlayer.pointsWonOnReturn++;
        } else {
          if (isFirstServing) {
            sko.push(kRallyPointWonOnReceiveFirstServe);
            soOpposition.pointsWonOnReturnOffFirstServes++;
            soOpposition.pointsWonOnReturnOffFirstServesRallies.push(
              r.events[0]
            );
          } else {
            sko.push(kRallyPointWonOnReceiveSecondServe);
            soOpposition.pointsWonOnReturnOffSecondServes++;
            soOpposition.pointsWonOnReturnOffSecondServesRallies.push(
              r.events[0]
            );
          }
          soOpposition.pointsWonOnReturn++;
        }
      }
    } else if (skill === kKeypoint) {
      if (outcome === kRallyOutcomeUnforcedError) {
        //                NSLog(@"FH outcome = %d skill = %d %@", outcome, skill, e.player.lastName);
        sko.push(kRallyKeypointUnforcedError);
        if (hand === kForehand) {
          so.forehandUnforcedErrors++;
          so.forehandUnforcedErrorsEvents.push(e);
        } else {
          so.backhandUnforcedErrors++;
          so.backhandUnforcedErrorsEvents.push(e);
        }
      } else if (
        outcome === kRallyOutcomeWinner ||
        outcome === kRallyOutcomePassingShot ||
        outcome === kRallyOutcomePutAway
      ) {
        sko.push(kRallyKeypointWinner);
        if (hand === kForehand) {
          so.forehandWinners++;
          so.forehandWinnersEvents.push(e);
          so.totalWinners++;
          so.totalWinnersEvents.push(e);
        } else {
          so.backhandWinners++;
          so.backhandWinnersEvents.push(e);
          so.totalWinners++;
          so.totalWinnersEvents.push(e);
        }
      } else if (outcome === kRallyOutcomeForcingError) {
        sko.push(kRallyKeypointForcingError);
        if (hand === kForehand) {
          so.forehandForcingErrors++;
          so.forehandForcingErrorsEvents.push(e);
        } else {
          so.backhandForcingErrors++;
          so.backhandForcingErrorsEvents.push(e);
        }
      } else {
        if (result === 0) {
          //                    NSLog(@"FH outcome = %d skill = %d %@", outcome, skill, e.player.lastName);
          sko.push(kRallyKeypointUnforcedError);
          if (hand === kForehand) {
            so.forehandUnforcedErrors++;
            so.forehandUnforcedErrorsEvents.push(e);
          } else {
            so.backhandUnforcedErrors++;
            so.backhandUnforcedErrorsEvents.push(e);
          }
        }
      }
      if (hand === kForehand) {
        so.maxSpeedRallyFH = Math.max(eballspeed, so.maxSpeedRallyFH);
        so.totalSpeedRallyFH += eballspeed;
        so.totalSpinrateTopRallyFH += isTopspin ? espinrate : 0;
        so.rallyTopFHs += isTopspin ? 1 : 0;
        so.totalSpinrateBackRallyFH += isTopspin ? 0 : espinrate;
        so.rallyBackFHs += isTopspin ? 0 : 1;
        if (result !== 0) {
          so.rallyWinnerFH++;
          so.totalNetXHeightWinnerFH += netxheight;
        }
      } else {
        so.maxSpeedRallyBH = Math.max(eballspeed, so.maxSpeedRallyBH);
        so.totalSpeedRallyBH += eballspeed;
        so.totalSpinrateTopRallyBH += isTopspin ? espinrate : 0;
        so.rallyTopBHs += isTopspin ? 1 : 0;
        so.totalSpinrateBackRallyBH += isTopspin ? 0 : espinrate;
        so.rallyBackBHs += isTopspin ? 0 : 1;
        if (result !== 0) {
          so.rallyWinnerBH++;
          so.totalNetXHeightWinnerBH += netxheight;
        }
      }
    } else if (skill === kRally) {
      if (hand === kForehand) {
        so.maxSpeedRallyFH = Math.max(eballspeed, so.maxSpeedRallyFH);
        so.totalSpeedRallyFH += eballspeed;
        so.totalSpinrateTopRallyFH += isTopspin ? espinrate : 0;
        so.rallyTopFHs += isTopspin ? 1 : 0;
        so.totalSpinrateBackRallyFH += isTopspin ? 0 : espinrate;
        so.rallyBackFHs += isTopspin ? 0 : 1;
        so.rallyInFH++;
        so.totalNetXHeightFH += netxheight;
      } else {
        so.maxSpeedRallyBH = Math.max(eballspeed, so.maxSpeedRallyBH);
        so.totalSpeedRallyBH += eballspeed;
        so.totalSpinrateTopRallyBH += isTopspin ? espinrate : 0;
        so.rallyTopBHs += isTopspin ? 1 : 0;
        so.totalSpinrateBackRallyBH += isTopspin ? 0 : espinrate;
        so.rallyBackBHs += isTopspin ? 0 : 1;
        so.rallyInBH++;
        so.totalNetXHeightBH += netxheight;
      }
    }

    if (skill !== kServing) {
      const twometres = (2 * 100) / 11.5;
      if (e.result !== 0) {
        const be = stringToPoint(e.endBall);
        if (
          (be.y < twometres && be.y >= 0) ||
          (be.y > 200 - twometres && be.y <= 200)
        ) {
          so.totalShotsWithin2mOfBaseLine++;
          so.totalShotsWithin2mOfBaseLineEvents.push(e);
        }
      }
    }
    n++;
  }
  return { statsA: soPlayer, statsB: soOpposition };
}

export function getRalliesInMatch(m) {
  var isDoubles = m.isDoubles;
  var lastr = null;
  var homeMatchScore = 0;
  var awayMatchScore = 0;
  var dicRallies = {};
  var rallies = [];
  var dataChanged = false;

  var events = [];
  for (var se of m.sets) {
    events.push(...se.events);
    if (!se.isDoublesTiebreak && se.isTiebreak) {
      if (se.playerScore + se.oppositionScore === 13) {
        se.isTiebreak = true;
      } else {
        se.isTiebreak = false;
      }
    }
  }

  var xa = [];

  var returnEvent = null;
  for (var e of events) {
    e.selected = false;
    var result = getResultFromOutcome(e);
    var skill = e.skill;
    var subskill1 = e.subskill1;
    var outcome = e.outcome;
    var sm = m.sets[e.setNumber - 1];

    if (
      skill === kServing &&
      (outcome === kServeAce || outcome === kServeWinner)
    ) {
      if (result !== 3) {
        dataChanged = true;
        e.result = 3;
      }
    } else if (
      skill === kServing &&
      (outcome === kServeOut || outcome === kServeFootfault)
    ) {
      if (result !== 0) {
        dataChanged = true;
        e.result = 0;
      }
    } else if (skill === kReturning) {
      returnEvent = e;
    }

    xa.push(e);
    if (result === 0) {
      if (skill === kServing && subskill1 === kServeFirst) {
        //                DLog(@"%@", e.description);
      } else {
        if (skill === kServing && subskill1 === kServeSecond) {
          //                    DLog(@"%@", e.description);
        }
        var r = createRally(e, xa, lastr, m);
        r.returnEvent = returnEvent;
        returnEvent = null;
        if (lastr && lastr.isSetEnd) {
          var lastre = lastr.events[0];
          var hsc = sm.playerScore;
          var asc = sm.oppositionScore;
          if (hsc > asc) {
            homeMatchScore++;
          } else {
            awayMatchScore++;
          }
        }
        r.homeMatchScore = homeMatchScore;
        r.awayMatchScore = awayMatchScore;
        if (e.player === m.player1) {
          r.winner = m.player2;
        } else if (e.player === m.player2) {
          r.winner = m.player1;
        }
        var s = e.setNumber + "-" + e.scores;
        if (dicRallies[s] === undefined) {
          var firstevent = r.events[0];
          var lastevent = r.events[r.events.length - 1];
          var dur = lastevent.timestamp - firstevent.timestamp;
          r.duration = dur + 8;
          dicRallies[s] = r;
          rallies.push(r);
        } else {
          //                    DLog(@"%@", e.description);
        }
        xa = [];
        lastr = r;
      }
    } else if (result === 3) {
      var r = createRally(e, xa, lastr, m);
      if (lastr && lastr.isSetEnd) {
        var lastre = lastr.events[0];
        var hsc = sm.playerScore;
        var asc = sm.oppositionScore;
        if (hsc > asc) {
          homeMatchScore++;
        } else {
          awayMatchScore++;
        }
      }
      r.homeMatchScore = homeMatchScore;
      r.awayMatchScore = awayMatchScore;
      if (e.player === m.player1) {
        r.winner = m.player1;
      } else if (e.player === m.player2) {
        r.winner = m.player2;
      }
      var s = e.setNumber + "-" + e.scores;
      if (dicRallies[s] === undefined) {
        var firstevent = r.events[0];
        var lastevent = r.events[r.events.length - 1];
        var dur = lastevent.timestamp - firstevent.timestamp;
        r.duration = dur + 8;
        dicRallies[s] = r;
        rallies.push(r);
      } else {
        //                DLog(@"%@", e.description);
      }
      xa = [];
      lastr = r;
    }
  }

  if (isDoubles) {
    for (var r of rallies) {
      if (r.winner === m.teamA.player1 || r.winner === m.teamA.player2) {
        r.teamwinner = m.teamA;
      } else if (r.winner === m.teamB.player1 || r.winner === m.teamB.player2) {
        r.teamwinner = m.teamB;
      }
    }
  }

  return rallies;
}

export function getResultFromOutcome(e) {
  var outcome = e.outcome;
  var skill = e.skill;

  if (skill === kServing) {
    if (outcome === kServeAce || outcome === kServeWinner) {
      return 3;
    } else if (
      outcome === kServeFootfault ||
      outcome === kServeOut ||
      outcome === kServeNet ||
      outcome === kServeOutOffNet
    ) {
      return 0;
    } else {
      return 1;
    }
  } else if (skill === kReturning) {
    if (outcome === kReturnWinner || outcome === kReturnPassingShot) {
      return 3;
    } else if (
      outcome === kReturnUnforcedError ||
      outcome === kReturnForcingError ||
      outcome === kReturnOut ||
      outcome === kReturnNetted
    ) {
      return 0;
    } else {
      return 1;
    }
  } else if (skill === kRally || skill === kKeypoint) {
    if (
      outcome === kRallyOutcomeWinner ||
      outcome === kRallyOutcomePassingShot ||
      outcome === kRallyOutcomePutAway
    ) {
      return 3;
    } else if (
      outcome === kRallyOutcomeOut ||
      outcome === kRallyOutcomeUnforcedError ||
      outcome === kRallyOutcomeForcingError ||
      outcome === kRallyOutcomeNetted ||
      outcome === kRallyOutcomeNettedPassingShot ||
      outcome === kRallyOutcomeOutPassingShot
    ) {
      return 0;
    } else {
      return 1;
    }
  }
  return 1;
}

export function createRally(e, xa, lastr, m) {
  var isDoubles = m.isDoubles;
  var r = [];
  r.isDoubles = isDoubles;
  r.lastRally = lastr;
  if (lastr !== null) {
    lastr.nextRally = r;
  }
  r.events = xa;
  var ev = r.events[0];
  for (var eve of r.events) {
    if (eve.skill === kServing) {
      r.server = e.player;
      break;
    }
  }
  var sm = m.sets[e.setNumber - 1];
  r.isSetTiebreak = sm.isTiebreak;

  // r.set = s;
  var homeGameScore = 0;
  var awayGameScore = 0;

  var xresult = getResultFromOutcome(e);
  var result = e.result;
  if (xresult !== result) {
    e.result = xresult;
  }
  if (xresult === 0) {
    if (isDoubles) {
      if (e.player === m.teamA.player1 || e.player === m.teamA.player2) {
        r.teamwinner = m.teamB;
      } else {
        r.teamwinner = m.teamA;
      }
    } else {
      if (e.player === m.player1) {
        r.winner = m.player2;
      } else {
        r.winner = m.player1;
      }
    }
  } else if (xresult === 3) {
    if (isDoubles) {
      r.winner = e.player;
      if (e.player === m.teamA.player1 || e.player === m.teamA.player2) {
        r.teamwinner = m.teamA;
      } else {
        r.teamwinner = m.teamB;
      }
    } else {
      if (e.player === m.player1) {
        r.winner = m.player1;
      } else {
        r.winner = m.player2;
      }
    }
  }

  var nVideoLeadTime = 3; //[[NSUserDefaults standardUserDefaults] valueForKey:@"videoLeadTime"];
  var nVideoLagTime = 3; //[[NSUserDefaults standardUserDefaults] valueForKey:@"videoLagTime"];

  var dt = m.videoStartTime !== 0 ? m.videoStartTime : m.matchDate;
  r.startTime = dt === null ? -1 : ev.timestamp - nVideoLeadTime;
  ev = r.events[r.events.length - 1];
  r.endTime = dt === null ? -1 : ev.timestamp + nVideoLagTime;
  r.homeScore = e.playerSetScore;
  r.awayScore = e.oppositionSetScore;
  r.setNumber = e.setNumber;
  r.homeGameScore = e.playerGameScore;
  r.awayGameScore = e.oppositionGameScore;

  if (sm.isTiebreak && e.playerSetScore === 6 && e.oppositionSetScore === 6) {
    if (
      e.playerGameScore >= 6 &&
      e.playerGameScore > e.oppositionGameScore &&
      (r.winner === m.player1 || (isDoubles && r.teamwinner === m.teamA))
    ) {
      r.isGameEnd = true;
    }
    if (
      e.oppositionGameScore >= 6 &&
      e.oppositionGameScore > e.playerGameScore &&
      (r.winner === m.player2 || (isDoubles && r.teamwinner === m.teamB))
    ) {
      r.isGameEnd = true;
    }
  } else {
    if (
      isGamepoint(r, m) &&
      (r.winner === r.server || r.teamwinner === r.servingTeam)
    ) {
      if (r.server === m.player1 || (isDoubles && r.servingTeam === m.teamA)) {
        homeGameScore++;
      } else {
        awayGameScore++;
      }
      r.isGameEnd = true;
    }
    if (
      isBreakpoint(r, m) &&
      (r.winner !== r.server || (isDoubles && r.teamwinner !== r.servingTeam))
    ) {
      if (r.server !== m.player1 || (isDoubles && r.servingTeam !== m.teamA)) {
        homeGameScore++;
      } else {
        awayGameScore++;
      }
      r.isGameEnd = true;
    }
  }

  if (r.isGameEnd) {
    if (sm.isTiebreak) {
      if (e.playerSetScore === 6 && e.oppositionSetScore === 6) {
        r.isSetEnd = true;
      }
    } else {
      //            if (e.playerSetScore >= 5 && (e.playerSetScore > e.oppositionSetScore))
      if (
        e.playerSetScore >= 5 &&
        (r.winner === m.player1 || (isDoubles && r.teamwinner === m.teamA))
      ) {
        r.isSetEnd = true;
      }
      //            else if (e.oppositionSetScore >= 5 && (e.oppositionSetScore > e.playerSetScore))
      else if (
        e.oppositionSetScore >= 5 &&
        (r.winner === m.player2 || (isDoubles && r.teamwinner === m.teamB))
      ) {
        r.isSetEnd = true;
      }
    }
  }
  return r;
}

function isPlayerBreakpoint(r, m) {
  if (r.isTiebreak && r.homeScore === 6 && r.awayScore === 6) {
    return false;
  }
  if (m.isDoubles) {
    if (
      r.server === m.teamB.player1 ||
      r.server === m.teamB.player2 ||
      r.servingTeam === m.teamB
    ) {
      if (r.homeGameScore > 2 && r.homeGameScore > r.awayGameScore) {
        return true;
      }
    }
    return false;
  } else {
    if (r.server === m.player2) {
      if (r.homeGameScore > 2 && r.homeGameScore > r.awayGameScore) {
        return true;
      }
    }
    return false;
  }
}

function isGamepoint(r, m) {
  if (
    (r.homeGameScore > 2 || r.awayGameScore > 2) &&
    r.homeGameScore !== r.awayGameScore
  ) {
    if (r.events.length > 0) {
      var e = r.events[0];
      if (e.player === m.player1 && r.homeGameScore > r.awayGameScore)
        return true;
      if (e.player === m.player2 && r.awayGameScore > r.homeGameScore)
        return true;
    }
  }

  return false;
}

function isBreakpoint(r, m) {
  if (r.isTiebreak && r.homeScore === 6 && r.awayScore === 6) {
    return false;
  }
  if (
    (r.homeGameScore > 2 || r.awayGameScore > 2) &&
    r.homeGameScore !== r.awayGameScore
  ) {
    if (r.events.length > 0) {
      var e = r.events[0];
      if (e.player === m.player1 && r.awayScore > r.homeScore) return true;
      if (e.player === m.player2 && r.homeScore > r.awayScore) return true;
    }
  }

  return false;
}

function isOppositionBreakpoint(r, m) {
  if (r.isTiebreak && r.homeScore === 6 && r.awayScore === 6) {
    return false;
  }
  if (m.isDoubles) {
    if (
      r.server === m.teamA.player1 ||
      r.server === m.teamA.player2 ||
      r.servingTeam === m.teamA
    ) {
      if (r.awayGameScore > 2 && r.awayGameScore > r.homeGameScore) {
        return true;
      }
    }
    return false;
  } else {
    if (r.server === m.player1) {
      if (r.awayGameScore > 2 && r.awayGameScore > r.homeGameScore) {
        return true;
      }
    }
    return false;
  }
}

function initStatsObject() {
  const obj = {
    aces: 0,
    acesEvents: [],
    atNets: 0,
    backhandForcingErrors: 0,
    backhandForcingErrorsEvents: [],
    backhandReturnErrors: 0,
    backhandUnforcedErrors: 0,
    backhandUnforcedErrorsEvents: [],
    backhandWinners: 0,
    backhandWinnersEvents: [],
    breakPoints: 0,
    breakPointsEvents: [],
    breakPointsConverted: 0,
    breakPointsConvertedRallies: [],
    distanceCovered: 0,
    doublefaults: 0,
    doublefaultsEvents: [],
    firstServeFaults: 0,
    firstServeIns: 0,
    firstServeInsEvents: [],
    firstServes: 0,
    firstServeAces: 0,
    firstServesReturned: 0,
    firstServesReturnedEvents: [],
    firstServicePointsWon: 0,
    firstServicePointsWonRallies: [],
    forehandForcingErrors: 0,
    forehandForcingErrorsEvents: [],
    forehandReturnErrors: 0,
    forehandUnforcedErrors: 0,
    forehandUnforcedErrorsEvents: [],
    forehandWinners: 0,
    forehandWinnersEvents: [],
    maxSpeedFirstServe: 0,
    maxSpeedRallyBH: 0,
    maxSpeedRallyFH: 0,
    maxSpeedSecondReturnBH: 0,
    maxSpeedSecondReturnFH: 0,
    maxSpeedSecondServe: 0,
    pointsWonOnReturn: 0,
    pointsWonAtNet: 0,
    pointsWonOnReturnOffFirstServes: 0,
    pointsWonOnReturnOffFirstServesRallies: [],
    pointsWonOnReturnOffSecondServes: 0,
    pointsWonOnReturnOffSecondServesRallies: [],
    rallyBackBHs: 0,
    rallyBackFHs: 0,
    rallyInBH: 0,
    rallyInFH: 0,
    rallyTopBHs: 0,
    rallyTopFHs: 0,
    rallyWinnerBH: 0,
    rallyWinnerFH: 0,
    returnsFirstServe: 0,
    returnsSecondServe: 0,
    returnsFirstServeBackBHs: 0,
    returnsFirstServeBackFHs: 0,
    returnsFirstServeTopBHs: 0,
    returnsFirstServeTopFHs: 0,
    returnForehandWinners: 0,
    returnForehandWinnersEvents: [],
    returnBackhandWinners: 0,
    returnBackhandWinnersEvents: [],
    returnsInBH: 0,
    returnsInFH: 0,
    returnsWinnerBH: 0,
    returnsWinnerFH: 0,
    returnsSecondServeBackBHs: 0,
    returnsSecondServeBackFHs: 0,
    returnsSecondServeTopBHs: 0,
    returnsSecondServeTopFHs: 0,
    secondServeAces: 0,
    secondServeIns: 0,
    secondServes: 0,
    secondServesReturned: 0,
    secondServicePointsWon: 0,
    secondServicePointsWonRallies: [],
    serveWinners: 0,
    serveWinnersEvents: [],
    totalNetXHeightBH: 0,
    totalNetXHeightFH: 0,
    totalReturnNetXHeightBH: 0,
    totalReturnNetXHeightFH: 0,
    totalReturns: 0,
    totalServes: 0,
    totalSpeedFirstServe: 0,
    totalSpeedRallyBH: 0,
    totalSpeedRallyFH: 0,
    totalSpeedSecondReturnBH: 0,
    totalSpeedSecondReturnFH: 0,
    totalSpeedSecondServe: 0,
    totalSpinrateBackRallyBH: 0,
    totalSpinrateBackRallyFH: 0,
    totalSpinrateBackSecondReturnBH: 0,
    totalSpinrateBackSecondReturnFH: 0,
    totalSpinrateTopRallyBH: 0,
    totalSpinrateTopRallyFH: 0,
    totalSpinrateTopSecondReturnBH: 0,
    totalSpinrateTopSecondReturnFH: 0,
    totalPointsWon: 0,
    totalPointsWonRallies: [],
    totalWinners: 0,
    totalWinnersEvents: [],
    totalLongRalliesWon: 0,
    totalLongRalliesWonRallies: [],
    totalMediumRalliesWon: 0,
    totalMediumRalliesWonRallies: [],
    totalShortRalliesWon: 0,
    totalShortRalliesWonRallies: [],
    totalShotsWithin2mOfBaseLine: 0,
    totalShotsWithin2mOfBaseLineEvents: [],
  };
  return obj;
}

// function isPressurePointForPlayer(pl, r)
// {
//     if (r.homeScore == 6 && r.awayScore == 6)
//     {
//         return true;
//     }
    
//     var p1score = r.firstServe.playerGameScore;
//     var p2score = r.firstServe.oppositionGameScore;
//     if (pl == set.match.player)
//     {
//         if (isOppositionBreakpoint(r, m)) return true;
//         // point leads to a break point eg 30-30, 40-40
//         if (p2score >= 2 && p1score <= p2score) return true;
//     }
//     else if (pl == m.player2)
//     {
//         if (isPlayerBreakpoint(r, m)) return true;
//         // point leads to a break point eg 30-30, 40-40
//         if (p1score >= 2 && p2score <= p1score) return true;
//     }
//     return false;
// }
