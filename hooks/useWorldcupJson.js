import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function useWorldcupJson() {
    let {data, error} = useSWR("https://worldcupjson.net/matches/?by_date=ASC", fetcher);
    if (error || data?.message ) {
        return [ undefined, undefined, undefined, undefined, true ];
    }

    const completedMatch = data?.filter(item => item.status === "completed");
    const nextMatch = data?.filter(item => item.status === "future_scheduled");
    const liveMatch = data?.filter(item => item.status === "in_progress");
    const hasLiveMatch = liveMatch?.length == 1;

    const currentMatch = hasLiveMatch ? liveMatch?.at(0) : completedMatch?.at(-1);

    return [ currentMatch, nextMatch, completedMatch, hasLiveMatch, error ];
}
