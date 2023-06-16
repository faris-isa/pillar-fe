import type { PageServerLoad } from "./$types"
import config from "$lib/config.json"

export const load: PageServerLoad = async ({ cookies, locals, parent }) => {
    await parent()
	const token: any = cookies.get('token');

	const fetchData = async () => {
		try {
			const res = await (await fetch(config.domain + "/static/prioritas.json")).json();
			const data = res ? res : [];
			return data;
		} catch (error) {
			return [];
		}
    }
    
	return {
		user: locals.user,
		priorities: fetchData()
	}
}