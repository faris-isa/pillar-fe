import type { PageServerLoad } from "./$types"
import config from "$lib/config.json"
import { fail, type Actions, type RequestEvent } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies, locals, parent }) => {
    await parent()
	const token: any = cookies.get('token');

	const fetchOption = async () => {
		try {
			const res = await (await fetch(config.domain + "/inventory", {headers: {token : token}, mode: "cors", credentials: "include"})).json();
			const data = res.message == "OK" ? res.data : [];
			return data;
		} catch (error) {
			return [];
		}
    }

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
		option: fetchOption(),
		inventory: fetchData()
	}
}

export const actions: Actions = {
    fifoSubmit:async ({ request, cookies }: RequestEvent) => {
		const token: any = cookies.get('token');

        const dataForm = await request.formData();
        const kode_barang = dataForm.get('valueBarang');    

        if(!kode_barang){
            return fail(403, {
                error: true,
                message: 'Please, form required  !',
                kode_barang
            })
        }

        let res = await (await fetch(config.domain + "/inventory/fifo", {
            headers: {
                token: token, 
                'Content-Type': 'application/json'
            }, mode: "cors", method: "POST",
            body: JSON.stringify({
				kode_barang
            })
        })).json()
        const statusCode  = res.statusCode;
		if (statusCode > 200){
			return fail(statusCode, {
				error: true,
				message: res.message,
				kode_barang
			})
		}

		const data = res.message == "OK" ? res.data[0] : [];
		return data;
        
    }
}