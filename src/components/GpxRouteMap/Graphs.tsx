import * as React from 'react'

interface GraphsProps {
    data: Array<number>
}

function Graphs({ data }: GraphsProps) {
    let divs: Array<React.JSX.Element> = []

    const max = Math.max(...data)
    const min = Math.min(...data)
    const len = max - min
    let key = 0

    data.forEach((value) => {
        const height = ((value - min) / len) * 100
        const divStyle = {
            width: `${300/data.length}px`,
            height: `${height + 0.1}%`
        }
        const div = <div key={key} style={divStyle} className="dataPoint"></div>
        divs.push(div)
        key++
    })

    return <div key='graph' className="graphContainer">
        { divs }
    </div>
}

export default Graphs