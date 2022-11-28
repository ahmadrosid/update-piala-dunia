import useWorldcupJson from "../hooks/useWorldcupJson";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import { useState } from "react";

dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)

const getDay = (datetime) => {
  return dayjs(datetime).isToday() ? "Today" : "" + dayjs(datetime).isTomorrow() ? "Tomorrow" : "";
}

export default function Home() {
  const [currentMatch, nextMatch, completedMatch, hasLiveMatch, error] = useWorldcupJson();
  const [maxCompletedMatch, setMaxCompletedMatch] = useState(4);

  const prefixImgUrl = "https://api.fifa.com/api/v3/picture/flags-sq-3/";

  if (error) {
    return <div className="bg-black h-screen w-screen flex items-center justify-center">
      <p>Failed loading the data.</p>
    </div>
  }

  if (!currentMatch) {
    return <div className="bg-black h-screen w-screen flex items-center justify-center">
      <p>Loading the data.</p>
    </div>
  }

  return (
    <div className="bg-black w-full min-h-screen h-full px-6">
      <div className="text-center p-8 space-y-4">
        <h1 className="text-6xl font-bold tracking-wide">Update Piala Dunia</h1>
        <p className="text-xl">Dapatkan update piala dunia QATAR 2022 secara Realtime dar Genggaman Anda.</p>
      </div>
      <div className="flex justify-center w-full">
        <div className="max-w-[550px] w-full border border-dashed rounded-lg p-6">
          <h2 className="text-2xl pb-4">Current match</h2>
          <div className="flex justify-between items-center gap-4">
            <div className="text-center space-y-4">
              <img src={prefixImgUrl + currentMatch.home_team.country} />
              <h3 className="text-lg">{currentMatch.home_team.name}</h3>
            </div>
            <div className="text-center">
              <h3 className="space-x-2 text-4xl font-bold">
                <span>{currentMatch.home_team.goals}</span>
                <span>{" : "}</span>
                <span>{currentMatch.away_team.goals}</span>
              </h3>
              <div>{currentMatch.winner} {currentMatch.winner !== "Draw" && "Wins"}</div>
            </div>
            <div className="text-center space-y-4">
              <img src={prefixImgUrl + currentMatch.away_team.country} />
              <h3 className="text-lg">{currentMatch.away_team.name}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-[550px] mx-auto w-full">
          <h2 className="text-3xl">Next Match</h2>
          <div className="py-4">
            <ul className="space-y-4">
              {nextMatch.slice(0, 4).map(item => <li key={item.id} className="flex gap-4">
                <div className="w-4">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  <div className="h-full px-1 pb-3 pt-1">
                    <span className="block w-[4px] opacity-50 bg-amber-50 h-full"></span>
                  </div>
                </div>
                <div>
                  <p className="text-amber-400 text-sm">{dayjs(item.datetime).format("MMMM DD")}</p>
                  <div className="py-2">
                    <h3 className="font-light text-xl">
                      {item.home_team.name} vs {item.away_team.name}
                    </h3>
                    <p className="opacity-75">{getDay(item.datetime)}, {dayjs(item.datetime).format("HH:DD")}</p>
                  </div>
                </div>
              </li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-[550px] mx-auto w-full">
          <h2 className="text-3xl">Completed Match</h2>
          <div className="py-4">
            <ul className="space-y-4">
              {completedMatch.reverse().slice(0, maxCompletedMatch).map((item, index) => <li key={item.id} className="flex gap-4">
                <div className="w-4">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  {index !== maxCompletedMatch-1 && <div className="h-full px-1 pb-3 pt-1">
                    <span className="block w-[4px] opacity-50 bg-amber-50 h-full"></span>
                  </div>}
                </div>
                <div>
                  <p className="text-amber-400 text-sm">{dayjs(item.datetime).format("MMMM DD")}</p>
                  <div className="py-2">
                    <h3 className="font-light text-xl space-x-2">
                      <span>{item.home_team.name} vs {item.away_team.name}, </span>
                      <span className="font-bold text-amber-400">{item.home_team.goals} : {item.away_team.goals}</span>
                    </h3>
                    <p>Result: {currentMatch.winner} { currentMatch.winner !== "Draw" &&  "Wins"}</p>
                    <p className="opacity-75">{dayjs(item.datetime).fromNow()}</p>
                  </div>
                </div>
              </li>)}
            </ul>
            {maxCompletedMatch == 4 ? <div className="w-full flex justify-center p-2">
              <button onClick={() => setMaxCompletedMatch(completedMatch.length)} className="text-sm px-6 py-2 border rounded-full">Show more</button>
            </div>: <div className="w-full flex justify-center p-2">
              <button onClick={() => setMaxCompletedMatch(4)} className="text-sm px-6 py-2 border rounded-full">Show less</button>
            </div>}
            
          </div>
        </div>
      </div>
    </div>
  )
}
