import { slog } from '$lib/utils';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, params, route, url }) => {
	return {
		params: params,
		route: route,
		url: url
	};
};
