import React from 'react'
import dynamic from "next/dynamic"

export const HelloInfraPage = (props) => {
    return (
        <div>Hello Infra /teams</div>
    )
}

export default dynamic(() => import("./index").then(d => d.HelloInfraPage), { ssr: false })
