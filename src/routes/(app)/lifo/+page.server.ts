import type { PageServerLoad } from "./$types"
import config from "$lib/config.json"

export const load: PageServerLoad = async ({ cookies, locals, parent }) => {
    await parent()
	const token: any = cookies.get('token');
    
	return {
		user: locals.user
	}
}