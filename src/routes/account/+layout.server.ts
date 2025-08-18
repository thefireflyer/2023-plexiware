import { withSession } from '$lib/api/user';
import type { PrismaClient, Session } from '@prisma/client';
import type { LayoutServerLoad } from './$types';
import db from '$lib/db/db';
import { json } from '@sveltejs/kit';
import { id, slog } from '$lib/utils';
import { getRequestEvent } from '$app/server';

export const load = (async ({ url, cookies }) => {
	return await withSession(cookies, async (session: Session) => {
		const query = url.searchParams.get('q');
		if (query != null) {
			const events = await db.event.findMany({
				where: {
					authorId: session.userId,
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
					authorId: session.userId,
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

			const folders = await db.folder.findMany({
				where: {
					authorId: session.userId,
					OR: [
						{
							name: {
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
					id: true
				}
			});

			const notes = await db.note.findMany({
				where: {
					authorId: session.userId,
					OR: [
						{
							title: {
								contains: query
							},
							content: {
								contains: query
							}
						}
					]
				},
				orderBy: {
					title: 'desc'
				},
				select: {
					title: true,
					id: true
				}
			});

			let results = [];

			if (query.includes('event') || query.includes('schedule')) {
				results.push({
					name: 'schedule',
					slug: '/account/schedule',
					icon: 'calendar_today'
				});
			}

			if (query.includes('file') || query.includes('folder')) {
				results.push({
					name: 'files',
					slug: '/account/files',
					icon: 'folder'
				});
			}

			if (
				query.includes('profile') ||
				query.includes('pfp ') ||
				query.includes('setting') ||
				query.includes('acc')
			) {
				results.push({
					name: 'profile settings',
					slug: '/account',
					icon: 'settings'
				});

				const user = await db.user.findUnique({
					where: {
						id: session.userId
					},
					select: {
						profilePicture: {
							select: {
								name: true,
								id: true
							}
						}
					}
				});

				if (user && user.profilePicture) {
					results.push({
						name: user.profilePicture.name,
						slug: '/account/files/inspect/' + user.profilePicture.id,
						icon: 'image'
					});
				}
			}

			return {
				sessionid: session.id,
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
						notes.map((note) => {
							return {
								name: note.title,
								slug: '/account/notes/' + note.id,
								icon: 'article'
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
					.concat(
						folders.map((folder) => {
							return {
								name: folder.name,
								slug: '/account/files/folder/' + folder.id,
								icon: 'folder'
							};
						})
					)
			};
		}

		return {
			sessionid: session.id,
			searchResults: []
		};
	});
}) satisfies LayoutServerLoad;
