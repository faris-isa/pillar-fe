import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad, RequestEvent } from "./$types";
import config from "$lib/config.json"

export const load: PageServerLoad = async ({ url, locals }) => {
    const fromUrl = url.pathname + url.search;
	if(!locals.user) throw redirect(301, `/login?redirectTo=${fromUrl}`)

    throw redirect(301, `/fifo`)
}