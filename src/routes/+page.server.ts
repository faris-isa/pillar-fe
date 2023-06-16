import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad, RequestEvent } from "./$types";

export const load: PageServerLoad = async ({ url, locals }) => {
    const fromUrl = url.pathname + url.search;
	if(!locals.user) throw redirect(301, `/login`)

    throw redirect(301, `/app`)
}