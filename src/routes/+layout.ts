import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, params, route, url }) => {
	let dt: any = data;
	return {
		...dt,
		params: params,
		route: route,
		url: url
	};
};
