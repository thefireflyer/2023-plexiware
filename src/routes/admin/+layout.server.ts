import db from '$lib/db/db';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ url }) => {
	const query = url.searchParams.get('q');
	if (query === null) {
		return { serachResults: [] };
	}
	const events = await db.event.findMany({
		where: {
			OR: [
				{
					title: {
						contains: query
					}
				},
				{
					description: {
						contains: query
					}
				}
			]
		},
		orderBy: {
			start: 'asc'
		},
		select: {
			title: true,
			id: true
		}
	});
	const files = await db.file.findMany({
		where: {
			OR: [
				{
					name: {
						contains: query
					}
				},
				{
					description: {
						contains: query
					}
				},
				{
					fileType: {
						contains: query
					}
				}
			]
		},
		orderBy: {
			dateLastAccessed: 'desc'
		},
		select: {
			name: true,
			id: true,
			fileType: true
		}
	});

	const results: { name: string; slug: string; icon: string }[] = [];
	return {
		searchResults: results
			.concat(
				events.map((event) => {
					return {
						name: event.title,
						slug: '/account/schedule/events/' + event.id,
						icon: 'today'
					};
				})
			)
			.concat(
				files.map((file) => {
					return {
						name: file.name,
						slug: '/account/files/inspect/' + file.id,
						icon: file.fileType.includes('image') ? 'image' : 'description'
					};
				})
			)
	};
}) satisfies LayoutServerLoad;
