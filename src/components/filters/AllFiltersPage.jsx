import { useState } from 'react'
import { Responsive, WidthProvider } from "react-grid-layout";
import { toast } from 'react-toastify'
import styled from "styled-components";
import MultiChoice from '../layout/MultiChoice'

const ResponsiveGridLayout = WidthProvider(Responsive);


const layout = [
    { i: "players", x: 0, y: 0, w: 1, h: 3, static: true },
    { i: "shots", x: 0, y: 3, w: 1, h: 15, static: true },
    { i: "directions", x: 0, y: 18, w: 1, h: 6, static: true },
    { i: "winners", x: 1, y: 0, w: 1, h: 3, static: true },
    { i: "forehand", x: 1, y: 3, w: 1, h: 10, static: true },
    { i: "backhand", x: 1, y: 13, w: 1, h: 10, static: true },
    { i: "sets", x: 2, y: 0, w: 0.8, h: 6, static: true },
    { i: "serves", x: 2, y: 6, w: 0.8, h: 5, static: true },
    { i: "outcome", x: 2, y: 11, w: 0.8, h: 5, static: true },
    { i: "reaches", x: 2, y: 16, w: 0.8, h: 5, static: true },
    { i: "scores", x: 2.8, y: 0, w: 0.8, h: 22, static: true },
    { i: "games", x: 3.6, y: 0, w: 0.4, h: 16, static: true },
    { i: "rally", x: 3.6, y: 16, w: 0.4, h: 5, static: true },
];

const GridItemWrapper = styled.div`
    background: #f5f5f5;
  `;

const GridItemContent = styled.div`
    padding: 1px;
  `;

const Root = styled.div`
    padding: 16px;
  `;

function AllFiltersPage({ allOptions, matches, playerGuid, handleFilterOptionChanged }) {

    const [, forceUpdate] = useState(0);

    const setPlayerNames = () =>
    {
        if (matches.length === 0)
        {
            return
        }
        for (var n=0; n<allOptions.length; n++)
        {
            var option = allOptions[n]
            var match = matches[0]
            if (option.title === "Players" || option.title === "Winners")
            {
                var pl1 = option.items[0]
                pl1.name = match.player1Guid === playerGuid ? match.player1LastName : match.player2LastName
                var pl2 = option.items[1]
                if (matches.length > 1)
                {
                    pl2.name = "Oppositions"
                }
                else
                {
                    pl2.name = match.player1Guid === playerGuid ? match.player2LastName : match.player1LastName
                }
            }
        }
    }

    const doOptionChanged = (options, item) => {
        if (options.title === "Scores")
        {
            var playersSelected = 0
            for (var n=0; n<allOptions.length; n++)
            {
                if (allOptions[n].title === "Players") 
                {
                    for (var i=0; i<allOptions[n].items.length; i++)
                    {
                        playersSelected += allOptions[n].items[i].selected ? 1 : 0
                    }
                    break
                }
            }
            if (playersSelected !== 1)
            {
                // if (item == null)
                // {
                //     options.allselected = !options.allselected
                // }
                // else
                // {
                //     item.selected = !item.selected
                // }
                // forceUpdate(n => !n)
                toast.error('Scores can not be analysed when all players are selected.')
                return
            }   
        }
        forceUpdate(n => !n)
        handleFilterOptionChanged(allOptions)
    }

    setPlayerNames()

    return (
        <Root>
            <ResponsiveGridLayout
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1100, md: 800, sm: 600, xs: 480, xxs: 0 }}
                cols={{ lg: 4, md: 4, sm: 3, xs: 2, xxs: 1 }}
                rowHeight={20}
                width={1000}
            >
                {allOptions.map((filter) => (
                   <GridItemWrapper key={filter.layout.i}>
                        <GridItemContent>
                            <MultiChoice filter={filter}
                                handleOptionChanged={(filter, item) => doOptionChanged(filter, item)}>
                            </MultiChoice>
                        </GridItemContent>
                    </GridItemWrapper>
                ))}
            </ResponsiveGridLayout>
        </Root>)
}

export default AllFiltersPage