import { writable } from 'svelte/store';
import type { RequestEvent } from "@sveltejs/kit"

import config from "$lib/config.json"

export const authenticateUser = async (event: RequestEvent) => {
    const { cookies } = event;
    const userToken: any = cookies.get("token");
    
    try {
        const getData = await fetch(config.domain + "/auth/check", { 
            headers: {token: userToken }, 
            mode: "cors", credentials: "include" ,method: "GET"
        })
        const dataJson = await getData.json()
        const res = dataJson.data ?? [];
        const res2 = res[0]
        let res3 = res2 ?? null
        if(dataJson.statusCode > 400) res3 = null;
        return res3;
    } catch (error) {
        return null;
    }
}