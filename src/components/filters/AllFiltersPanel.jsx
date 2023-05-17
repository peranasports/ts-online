import { useState } from 'react'
import { toast } from 'react-toastify'
import MultiChoice from '../utils/MultiChoice';

function AllFiltersPanel({ allOptions, matches, playerGuid, handleFilterOptionChanged }) {

    const [, forceUpdate] = useState(0);

    const setPlayerNames = () => {
        if (matches.length === 0) {
            return
        }
        for (var n = 0; n < allOptions.length; n++) {
            var option = allOptions[n]
            var match = matches[0]
            if (option.title === "Players" || option.title === "Winners") {
                var pl1 = option.items[0]
                pl1.name = match.player1Guid === playerGuid ? match.player1LastName : match.player2LastName
                var pl2 = option.items[1]
                if (matches.length > 1) {
                    pl2.name = "Oppositions"
                }
                else {
                    pl2.name = match.player1Guid === playerGuid ? match.player2LastName : match.player1LastName
                }
            }
        }
    }

    const doOptionChanged = (options, item) => {
        if (options.title === "Scores") {
            var playersSelected = 0
            for (var n = 0; n < allOptions.length; n++) {
                if (allOptions[n].title === "Players") {
                    for (var i = 0; i < allOptions[n].items.length; i++) {
                        playersSelected += allOptions[n].items[i].selected ? 1 : 0
                    }
                    break
                }
            }
            if (playersSelected !== 1) {
                toast.error('Scores can not be analysed when all players are selected.')
                return
            }
        }
        // forceUpdate(n => !n)
        handleFilterOptionChanged(allOptions)
    }

    const selectedOptions = (filter) => {
        var count = 0
        var s = ""
        for (var n = 0; n < filter.items.length; n++) {
            if (filter.items[n].selected) {
                if (s.length > 0) s += ", "
                s += filter.items[n].name.toUpperCase()
                count++
            }
        }
        if (count === filter.items.length) {
            return "ALL"
        }
        else if (count === 0) {
            return "NONE"
        }
        return s
    }

    setPlayerNames()

    return (
        <>
            {allOptions.map((filter) => (
                <div tabIndex={0} className="collapse collapse-arrow rounded-sm">
                    <input type="checkbox" className="peer" />
                    <div className="collapse-title pt-2 bg-base-300 text-lg font-medium  peer-checked:bg-base-100 peer-checked:text-base-700">
                        {filter.title.toUpperCase()}
                        <p className='text-xs font-normal'>{selectedOptions(filter)}</p>
                    </div>
                    <div className="collapse-content peer-checked:bg-base-100 ">
                        <MultiChoice filter={filter}
                            handleOptionChanged={(filter, item) => doOptionChanged(filter, item)}>
                        </MultiChoice>
                    </div>
                </div>
            ))}
            <div className="collapse-title">
            </div>
            <div className="collapse-content">
            </div>
        </>
    )
}

export default AllFiltersPanel