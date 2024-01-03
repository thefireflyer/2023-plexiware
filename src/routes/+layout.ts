import type { LayoutLoad } from './$types';

export const load = (async ({ data, params, route, url }) => {
    return {
        ...data,
        url: url,
    };
}) satisfies LayoutLoad;