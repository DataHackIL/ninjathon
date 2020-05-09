import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from 'next/router'





export const HelloInfraPage = (props) => {
    const router = useRouter()

    async function redirect() {
        router.replace(`/teams/browse`)
    }



  return (
    <div>
      <h1>Hello Infra /teams</h1>
      <button
        onClick={() => {
            redirect();
        }}
      >
        Browse Teams
      </button>
    </div>
  );
};

export default dynamic(() => import("./index").then((d) => d.HelloInfraPage), {
  ssr: false,
});
