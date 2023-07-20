import type { LayoutLoad } from './$types';

export const load = (async ({ params, route, url }) => {
    return {
        url: url,
        searchResults: url.searchParams.get("q") ? [{name:"test", slug:"/test"},
        {name:"test", slug:"/test"},
        {name:"test", slug:"/test"},
        {name:"test", slug:"/test"}] : null
    };
}) satisfies LayoutLoad;