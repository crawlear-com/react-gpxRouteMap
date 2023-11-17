import * as React from 'react'

interface GraphsProps {
    data: Array<number>
}

function Graphs({ data }: GraphsProps) {
    let divs: Array<React.JSX.Element> = []

    const max = Math.max(...data)
    const min = Math.min(...data)
    const len = max - min

    data.forEach((value) => {
        const height = ((value - min) / len) * 100
        const divStyle = {
            width: `${320/data.length}px`,
            height: `${height + 0.1}%`
        }
        const div = <div style={divStyle} className="dataPoint"></div>
        divs.push(div)
    })

    return <div className="graphContainer">
        { divs }
    </div>
}

export default Graphs