import type { PageServerLoad } from "./$types"
import config from "$lib/config.json"

export const load: PageServerLoad = async ({ cookies, locals, parent }) => {
    await parent()
	const token: any = cookies.get('token');

	const fetchData = async () => {
		try {
			const res = await (await fetch(config.domain + "/inventory/detail", {headers: {token : token}, mode: "cors", credentials: "include"})).json();
			const data = res.message == "OK" ? res.data : [];
			return data;
		} catch (error) {
			return [];
		}
    }
    
	return {
		user: locals.user,
		inventory: fetchData()
	}
}