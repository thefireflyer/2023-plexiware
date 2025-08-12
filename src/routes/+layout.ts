import type { LayoutLoad } from './$types';

export const load = (async ({ data, params, route, url }) => {
    let dt:any = data
    return {
        ...dt,
        params: params,
        route: route,
        url: url,
    };
}) satisfies LayoutLoad;