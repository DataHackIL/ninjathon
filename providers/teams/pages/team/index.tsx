import React from 'react'
import dynamic from "next/dynamic"

export const HelloInfraPage = (props) => {
    return (
        <div>Hello Infra /team</div>
    )
}

export default dynamic(() => import("./").then(d => d.HelloInfraPage), { ssr: false })
