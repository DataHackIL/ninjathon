import React from 'react'
import dynamic from "next/dynamic"

export const HelloInfraPage = (props) => {
    return (
        <div>Hello Infra</div>
    )
}

export default dynamic(() => import("./").then(d => d.HelloInfraPage), { ssr: false })
