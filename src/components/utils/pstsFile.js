import {
  kReturnOut,
  kReturnNetted,
  kReturnUnforcedError,
  kRallyOutcomeOut,
  kRallyOutcomeNetted,
  kRallyOutcomeUnforcedError,
  kCoachTag,
  kServing,
  kServeFirst,
  kServeFootfault,
  kServeSecond,
  kServeLet,
  kServeOut,
  kServeNet,
  kServeAce,
  kServeWinner,
  kServeTimeViolation,
  kServeCodeViolation,
  kServeOther,
  kReturning,
  kReturnForcingError,
  kReturnWinner,
  kRally,
  kKeypoint,
  kRallyDrive,
  kRallyTopspin,
  kRallyOutcomeIn,
  kRallyCounter,
  kMissingPoint,
  kMissingGame,
} from "./pstsDefines.js";

import {
  tryParseDateFromString,
  convertSecondsToDate,
  convertSecondsFrom01011970ToDate,
} from "./utils";

function getNextLineData(line) {
  const tokens = line.split("~");
  var label = tokens[0];
  var text = "";
  for (var nt = 1; nt < tokens.length; nt++) {
    if (text.length > 0) text += "~";
    text += tokens[nt];
  }
  try {
    if (text === "") {
      return null;
    }
    const json = text === "(null)" ? null : JSON.parse(text);
    return { label: label, json: json };
  } catch (error) {
    console.log(error.message);
    return { label: label, json: null };
  }
}

export function importPSTS(buffer) {
  var match = null;
  var lineno = 0;
  const lines = buffer.split(/\r\n/);
  const line = lines[lineno];
  if (n === 0) {
    if (line !== "PSTS") return null;
  }

  var json = getNextLineData(lines[++lineno]).json;

  match = {
    isDoubles: json.isDoubles,
    isPractice: false,
    matchDate: json.matchDate === undefined ? 0 : Date.parse(json.matchDate),
    videoStartTime: json.videoStartTime === undefined ? 0 : Date.parse(json.videoStartTime),
    scoreModeAdvantage: json.scoreModeAdvantage,
    scoreModeTiebreak: json.scoreModeTiebreak,
    roundName: json.roundName,
    temperature: json.temperature,
    videoFile: json.videoFile !== undefined ? json.videoFile.replace("m3u8", "mp4") : "",
    importedFrom: json.importedFrom,
    coder: json.coder,
    sets: [],
    videos: [],
  };

  json = getNextLineData(lines[++lineno]).json;
  match.tournament =
    json === null
      ? null
      : {
          name: json.name,
          guid: json.guid,
          startDate: convertSecondsToDate(json.startDate),
          enddate: convertSecondsToDate(json.endDate),
          gender: json.gender,
          prizeMoney: json.prizeMoney,
          code: json.code,
          year: json.year,
        };

  json = getNextLineData(lines[++lineno]).json;
  if (match.tournament !== null) {
    match.tournament.country = getCountry(json);
  }

  json = getNextLineData(lines[++lineno]).json;
  match.court =
    json === null
      ? null
      : {
          surface: json.surface,
        };

  json = getNextLineData(lines[++lineno]).json;
  match.round =
    json === null
      ? null
      : {
          notes: json.notes,
          number: json.number,
        };

  json = getNextLineData(lines[++lineno]).json;
  match.weather =
    json === null
      ? null
      : {
          code: json.code,
          notes: json.notes,
        };

  if (match.isDoubles) {
    json = getNextLineData(lines[++lineno]).json;
    match.teamA = getTeam(json);
    json = getNextLineData(lines[++lineno]).json;
    match.teamA.country = getCountry(json);
    json = getNextLineData(lines[++lineno]).json;
    match.teamA.player1 = getPlayer(json);
    json = getNextLineData(lines[++lineno]).json;
    match.teamA.player1.country = getCountry(json);
    json = getNextLineData(lines[++lineno]).json;
    match.teamA.player2 = getPlayer(json);
    json = getNextLineData(lines[++lineno]).json;
    match.teamA.player2.country = getCountry(json);

    json = getNextLineData(lines[++lineno]).json;
    match.teamB = getTeam(json);
    json = getNextLineData(lines[++lineno]).json;
    match.teamB.country = getCountry(json);
    json = getNextLineData(lines[++lineno]).json;
    match.teamB.player1 = getPlayer(json);
    json = getNextLineData(lines[++lineno]).json;
    match.teamB.player1.country = getCountry(json);
    json = getNextLineData(lines[++lineno]).json;
    match.teamB.player2 = getPlayer(json);
    json = getNextLineData(lines[++lineno]).json;
    match.teamB.player2.country = getCountry(json);
  } else {
    json = getNextLineData(lines[++lineno]).json;
    match.player1 = getPlayer(json);
    json = getNextLineData(lines[++lineno]).json;
    match.player1.country = getCountry(json);
    json = getNextLineData(lines[++lineno]).json;
    match.player2 = getPlayer(json);
    json = getNextLineData(lines[++lineno]).json;
    match.player2.country = getCountry(json);
  }

  var firste = null;
  var laste = null;
  var sm = null; // set
  var video = null;
  lineno++;
  for (var n = lineno; n < lines.length - 1; n++) {
    var nl = getNextLineData(lines[n]);
    json = nl.json;
    if (nl.label === "V") {
      video = getVideo(json);
      match.videos.push(video);
    } else if (nl.label === "S") {
      sm = getSet(json);
      match.sets.push(sm);
    } else if (nl.label === "E0") {
      var e = getEvent(json, sm, match);
      if (match.isDoubles) {
        e.player = match.teamA.player1;
        e.playerGuid = match.teamA.player1.guid;
        e.team = match.teamA;
      } else {
        e.player = match.player1;
        e.playerGuid = match.player1.guid;
      }
      if (laste && e.timestamp < laste.timestamp) {
        e.timestamp = laste.timestamp + 2;
      }
      if (firste === null) firste = e;
      laste = e;
      sm.events.push(e);
    } else if (nl.label === "E1") {
      var e = getEvent(json, sm, match);
      if (match.isDoubles) {
        e.player = match.teamA.player2;
        e.playerGuid = match.teamA.player2.guid;
        e.team = match.teamA;
      } else {
        e.player = match.player2;
        e.playerGuid = match.player2.guid;
      }
      if (laste && e.timestamp < laste.timestamp) {
        e.timestamp = laste.timestamp + 2;
      }
      if (firste === null) firste = e;
      laste = e;
      sm.events.push(e);
    } else if (nl.label === "E2") {
      var e = getEvent(json, sm, match);
      if (match.isDoubles) {
        e.player = match.teamB.player1;
        e.playerGuid = match.teamB.player1.guid;
        e.team = match.teamB;
      }
      if (laste && e.timestamp < laste.timestamp) {
        e.timestamp = laste.timestamp + 2;
      }
      if (firste === null) firste = e;
      laste = e;
      sm.events.push(e);
    } else if (nl.label === "E3") {
      var e = getEvent(json, sm, match);
      if (match.isDoubles) {
        e.player = match.teamB.player2;
        e.playerGuid = match.teamB.player2.guid;
        e.team = match.teamB;
      }
      if (laste && e.timestamp < laste.timestamp) {
        e.timestamp = laste.timestamp + 2;
      }
      if (firste === null) firste = e;
      laste = e;
      sm.events.push(e);
    }
  }
  match.player1CountryCode =
    match.player1.country === null ? "UNK" : match.player1.country.code;
  match.player1FirstName =
    match.player1.firstName === undefined ? "" : match.player1.firstName;
  match.player1LastName =
    match.player1.lastName === undefined ? "" : match.player1.lastName;
  match.player2CountryCode =
    match.player2.country === null ? "UNK" : match.player2.country.code;
  match.player2FirstName =
    match.player2.firstName === undefined ? "" : match.player2.firstName;
  match.player2LastName =
    match.player2.lastName === undefined ? "" : match.player2.lastName;
    match.player1Guid = match.player1.guid;
    match.player2Guid = match.player2.guid;
  for (var sm of match.sets)
  {
    for (var e of sm.events)
    {
      e.videoTime = e.timestamp - match.videoOffset;
      e.playerCountryCode = (e.player.country === null) ? "UNK" : e.player.country.code;
    }
  }
  return match;
}

function getPlayer(json) {
  var pl =
    json === null
      ? null
      : {
          firstName: json.firstName,
          lastName: json.lastName,
          userDefined01: json.userDefined01,
          userDefined02: json.userDefined02,
          dob: convertSecondsFrom01011970ToDate(json.dob),
          hand: json.hand,
          weight: json.weight,
          notes: json.notes,
          height: json.height,
          guid: json.guid,
          email: json.email,
          gender: json.gender,
        };
  return pl;
}

function getCountry(json) {
  var c =
    json === null
      ? null
      : {
          name: json.name,
          code: json.code,
        };
  return c;
}

function getTeam(json) {
  var t =
    json === null
      ? null
      : {
          name: json.name,
          code: json.code,
          notes: json.notes,
          userDefined01: json.userDefined01,
          userDefined02: json.userDefined02,
        };
  return t;
}

function getSet(json) {
  var s =
    json === null
      ? null
      : {
          number: json.number,
          currentSkill: json.currentSkill,
          isTiebreak: json.isTiebreak,
          oppositionGameScore: json.oppositionGameScore,
          oppositionScore: json.oppositionScore,
          playerGameScore: json.playerGameScore,
          playerScore: json.playerScore,
          serves: json.serves,
          servingZone: json.servingZone,
          onTopCourt: json.onTopCourt,
          user1: json.user1,
          user2: json.user2,
          events: [],
        };
  return s;
}

function getVideo(json) {
  var video =
    json === null
      ? null
      : {
          startTime: convertSecondsFrom01011970ToDate(json.startTime),
          name: json.name,
          videoOrder: json.videoOrder,
          url: json.url,
        };
  return video;
}

function getEvent(json, sm, match) {
  if (match.videoOffset === undefined && match.videoStartTime > 0)
  {
    const tt = new Date(json.timestamp)
    var vo = (json.timestamp - (match.videoStartTime/1000)) % 3600
    if (vo < 0)
    {
      vo += 3600
    }
    match.videoOffset = json.timestamp - vo;
  }
  var e =
    json === null
      ? null
      : {
          timestamp: json.timestamp,
          atNet: json.atNet,
          breakPoints: json.breakPoints,
          direction: json.direction,
          endBall: json.endBall,
          hand: json.hand,
          isServing: json.isServing,
          midBall: json.midBall,
          outcome: json.outcome,
          reach: json.reach,
          result: json.result,
          scores: json.scores,
          selected: json.selected,
          skill: json.skill,
          startBall: json.startBall,
          subskill1: json.subskill1,
          subskill2: json.subskill2,
          user1: json.user1,
          user2: json.user2,
          videoDuration: json.videoDuration,
          playerPositions: json.playerPositions,
          ballMetrics: json.ballMetrics,
          rallyOrder: json.rallyOrder,
          user3: json.user3,
          user4: json.user4,
          eventId: json.eventId,
          selected: false,
          setNumber: sm.number,
          videoFile: match.videoFile,
        };

  if (e.outcome === kReturnOut || e.outcome === kReturnNetted) {
    e.outcome = kReturnUnforcedError;
  } else if (
    e.outcome === kRallyOutcomeOut ||
    e.outcome === kRallyOutcomeNetted
  ) {
    e.outcome = kRallyOutcomeUnforcedError;
  }
  e.eventString = eventString(e);
  e.realScores = realScores(e, sm, match);
  return e;
}

export function eventString(e) {
  var s = "";
  const skill = e.skill;
  var subskill1 = e.subskill1;
  var subskill2 = e.subskill2;
  var outcome = e.outcome;
  var hand = e.hand;
  if (hand > 1) {
    hand = 1;
  }
  if (outcome < 0) {
    outcome = 0;
  }

  if (skill === kCoachTag) {
    return e.user1;
  } else if (skill === kServing) {
    var ss = subskill1 === kServeFirst ? "1st Serve" : "2nd Serve";
    if (outcome === kServeFootfault) {
      if (subskill1 === kServeSecond) {
        return ss + " - Double fault";
      } else {
        return ss + " - Footfault", ss;
      }
    } else if (outcome === kServeLet) {
      return ss + " - Let";
    } else if (outcome === kServeOut) {
      if (subskill1 === kServeSecond) {
        return ss + " - Double fault";
      } else {
        return ss + " - Out";
      }
    } else if (outcome === kServeNet) {
      if (subskill1 === kServeSecond) {
        return ss + " - Double fault";
      } else {
        return ss + " - Net";
      }
    } else if (outcome === kServeAce) {
      return ss + " - Ace";
    } else if (outcome === kServeWinner) {
      return ss + " - Winner";
    } else if (outcome === kServeTimeViolation) {
      return ss + " - Time Violation";
    } else if (outcome === kServeCodeViolation) {
      return ss + " - Code Violation";
    } else if (outcome === kServeOther) {
      return ss + " - Other Violation";
    } else {
      return ss;
    }
  } else if (skill === kReturning) {
    const outcomeMenu = [
      "In",
      "Off Net",
      "Volleyed",
      "Winner",
      "Forced Error",
      "Passing Shot",
      "Out",
      "Unforced Error",
      "First",
      "Second",
      "Netted",
    ];
    const handMenu = ["Forehand", "Backhand"];
    const rallyMenu = [
      "Drive",
      "Slice",
      "Topspin",
      "Volley",
      "Overhead",
      "Lob",
      "Drop",
      "Other",
      "Drive Volley",
      "Serve Volley",
      "Smash",
      "Approach",
      "Drop Volley",
      "Bounce Overhead",
      "Volley Poach",
      "Half Volley",
      "Attempted Passing Shot",
      "",
    ];

    if (subskill2 === -1) {
      subskill2 = rallyMenu.length - 1;
    }

    if (
      outcome === kReturnOut ||
      outcome === kReturnForcingError ||
      outcome === kReturnUnforcedError ||
      outcome === kReturnWinner
    ) {
      s =
        "Return " +
        handMenu[hand] +
        " - " +
        rallyMenu[subskill2] +
        " - " +
        outcomeMenu[outcome];
      return s;
    } else {
      s = "Return " + handMenu[hand] + " - " + rallyMenu[subskill2];
      return s;
    }
  } else if (skill === kRally || skill === kKeypoint) {
    const handMenu = ["Forehand", "Backhand"];
    const rallyMenu = [
      "Drive",
      "Slice",
      "Topspin",
      "Volley",
      "Overhead",
      "Lob",
      "Drop",
      "Other",
      "Drive Volley",
      "Serve Volley",
      "Smash",
      "Approach",
      "Drop Volley",
      "Bounce Overhead",
      "Volley Poach",
      "Half Volley",
      "Attempted Passing Shot",
      "",
    ];
    const outcomeMenu = [
      "In",
      "Out",
      "Winner",
      "Unforced Error",
      "Forced Error",
      "Passing Shot",
      "Netcord",
      "Put Away",
      "Netted",
      "OutOffNet",
      "NettedPassingShot",
      "Out Passing Shot",
      "Cancel",
    ];

    if (subskill2 === -1) {
      subskill2 = rallyMenu.length - 1;
    } else if (subskill2 === kRallyDrive) {
      subskill2 = kRallyTopspin;
    }

    if (outcome === kRallyOutcomeIn) {
      s = handMenu[hand] + " - " + rallyMenu[subskill2];
      return s;
    } else {
      s =
        handMenu[hand] +
        " - " +
        rallyMenu[subskill2] +
        " - " +
        outcomeMenu[outcome];
      return s;
    }
  } else if (skill === kRallyCounter) {
    s = "Rally shot";
  } else if (skill === kMissingPoint) {
    s = "Missing Point...";
  } else if (skill === kMissingGame) {
    s = "Missing Game...";
  }
  return s;
}

export function realScores(e, sm, match) {
  var a = e.scores.split(" ");
  if (a.length === 2) {
    var a1 = a[0].split(":");
    if (a1.length === 2)
    {
      e.playerSetScore = Number.parseInt(a1[0]);
      e.oppositionSetScore = Number.parseInt(a1[1]);
    }
    var a2 = a[1].split(":");
    if (a2.length === 2) {
      const ps = a2[0];
      const os = a2[1];
      e.playerGameScore = Number.parseInt(ps);
      e.oppositionGameScore = Number.parseInt(os);
      if (sm.isTiebreak && e.playerSetScore === 6 && e.oppositionSetScore === 6) {
        return e.scores;
      } else if (
        match.isDoubles &&
        sm.number === 3 &&
        match.scoreModeTiebreak > 0
      ) {
        return e.playerGameScore + "-" + e.oppositionGameScore;
      } else {
        var ss = ["00", "15", "30", "40"];
        var pss = "40";
        if (ps >= 0 && ps < 4) {
          pss = ss[ps];
        } else if (ps >= 4 && ps > os) {
          pss = "A";
        }
        var oss = "40";
        if (os >= 0 && os < 4) {
          oss = ss[os];
        } else if (os >= 4 && os > ps) {
          oss = "A";
        }
        return "%@ %@:%@", a[0] + " " + pss + ":" + oss;
      }
    }
  }
  return "";
}

