import { authenticateUser } from "$lib/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const user = await authenticateUser(event)
    event.locals.user = user;
    const response = await resolve(event);
    return response;
}