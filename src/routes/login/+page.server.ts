import {redirect, type RequestEvent } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types';
import config from "$lib/config.json";

export const load: PageServerLoad = async({ url, locals }) => {
    if (locals.user) {
        const redirectTo = url.searchParams.get('redirectTo');
        if(redirectTo){
            throw redirect(302, `/${redirectTo.slice(1)}`)
        }
        throw redirect(302, "/")
	}

    return {
        user: locals.user
    }
}

export const actions: Actions = {
    default:async ({request, cookies, url}: RequestEvent) => {
        const dataForm = await request.formData();
        const username = dataForm.get('username');
        const password = dataForm.get('password');

        if(!username || !password){
            return invalid(400, {
                statusCode: 400,
                error: true,
                message: "Form required !",
                username
            })
        }

        let res;

        try {
            res = await (
                await fetch(config.domain + "/auth/login", {
                    headers: {
                        'Content-Type': 'application/json'
                    }, 
                    mode: "cors", 
                    method: "POST",
                    body: JSON.stringify({
                        username,
                        password
                    })
                })
            ).json();
            const statusCode  = res.statusCode;
            if (statusCode != 200){
                return invalid(statusCode, {
                    statusCode,
                    error: true,
                    message: res.message,
                    username
                })
            }
        } catch (error) {
            return invalid(503, {
                statusCode: 503,
                error: true,
                message: "Service Unavailable"
            })
        }

        cookies.set('token', res.data[0].token, {
            path: '/',
            secure: false,
            httpOnly: true,
        });
        
        const redirectTo = url.searchParams.get('redirectTo');
        if(redirectTo) {
            // throw redirect(302, `/${redirectTo}`)
            throw redirect(302, `/${redirectTo.slice(1)}`)
        }
        throw redirect(301, res.data[0].redirect)

    }
}