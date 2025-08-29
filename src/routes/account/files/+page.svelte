<script lang="ts">
	import { goto, pushState } from '$app/navigation';
	import type { PageData } from './$types';

	let { data } = $props();
	console.log(data);

	//////////////////////////////////////////////////////////////////////////////

	type View = 'grid' | 'table' | 'tree';
	let view = $state('grid') as View;
	const isview = $derived((v: View) => {
		return v === view;
	});
	const setview = (v: View) => {
		return () => {
			view = v;
		};
	};

	//////////////////////////////////////////////////////////////////////////////

	const sizeToString = (s: bigint) => {
		if (s > BigInt(1000 ** 3)) {
			return parseFloat(s.toString()) / 1000.0 ** 3 + ' GB';
		} else if (s > BigInt(1000 ** 2)) {
			return parseFloat(s.toString()) / 1000.0 ** 2 + ' MB';
		} else {
			return parseFloat(s.toString()) / 1000.0 + ' kB';
		}
	};

	//////////////////////////////////////////////////////////////////////////////

	type SortOn = 'name' | 'size' | 'created' | 'modified' | 'accessed';
	type SortBy = -1 | 1;
	let sort = $state(false);
	let sortOn = $state('name') as SortOn;
	let sortBy = $state(1) as SortBy;

	//////////////////////////////////////////////////////////////////////////////

	let pfolders = $state(data.folders);
	let pfiles = $state(data.files);

	let sortfolders = () => {
		pfolders.sort((a, b) => {
			if (sortOn === 'name') {
				return sortBy * a.name.localeCompare(b.name);
			} else if (sortOn === 'size') {
				return sortBy * parseFloat((a.size - b.size).toString());
			} else if (sortOn === 'created') {
				return sortBy * (a.dateCreated.getSeconds() - b.dateCreated.getSeconds());
			} else if (sortOn === 'modified') {
				return sortBy * (a.dateLastModified.getSeconds() - b.dateLastModified.getSeconds());
			} else {
				return sortBy * (a.dateLastAccessed.getSeconds() - b.dateLastAccessed.getSeconds());
			}
		});
	};
	let sortfiles = () => {
		pfiles.sort((a, b) => {
			if (sortOn === 'name') {
				return sortBy * a.name.localeCompare(b.name);
			} else if (sortOn === 'size') {
				return sortBy * parseFloat((a.size - b.size).toString());
			} else if (sortOn === 'created') {
				return sortBy * (a.dateCreated.getSeconds() - b.dateCreated.getSeconds());
			} else if (sortOn === 'modified') {
				return sortBy * (a.dateLastModified.getSeconds() - b.dateLastModified.getSeconds());
			} else {
				return sortBy * (a.dateLastAccessed.getSeconds() - b.dateLastAccessed.getSeconds());
			}
		});
	};

	//////////////////////////////////////////////////////////////////////////////

	let folders_ = $derived(
		(sort ? pfolders : data.folders).map((folder) => {
			return {
				Folder: folder.name,
				Size: sizeToString(folder.size),
				'Date Created': folder.dateCreated.toLocaleString(),
				'Date Modified': folder.dateLastModified.toLocaleString(),
				'Date Viewed': folder.dateLastAccessed.toLocaleString(),
				url: '/account/files/folder/' + folder.id
			};
		})
	);
	let files_ = $derived(
		(sort ? pfiles : data.files).map((file) => {
			return {
				File: file.name,
				Size: sizeToString(file.size),
				'Date Created': file.dateCreated.toLocaleString(),
				'Date Modified': file.dateLastModified.toLocaleString(),
				'Date Viewed': file.dateLastAccessed.toLocaleString(),
				url: '/account/files/inspect/' + file.id
			};
		})
	);

	//////////////////////////////////////////////////////////////////////////////
</script>

{#snippet button(icon: string, active: boolean, onclick: () => void)}
	<button
		{onclick}
		class="flex justify-center justify-items-center p-1 px-2
		{active ? 'text-neutral-300' : 'text-neutral-500'}
		rounded-full hover:bg-neutral-800
		active:bg-neutral-900 active:text-neutral-600
		{active ? 'bg-neutral-800' : ''}
		"
	>
		<span class="material-icons-outlined">
			{icon}
		</span>
	</button>
{/snippet}

{#snippet table<K extends string>(cols: K[], rows: Record<K | 'url', string>[], onnew: string)}
	<table
		class="
	table-auto md:table-fixed
	border-separate border border-gray-800 rounded-md"
	>
		<tbody>
			<tr class="bg-ctp-mantle">
				{#each cols as col}
					<th class="border border-gray-800" style="width: {100 / cols.length}%;">{col}</th>
				{/each}
			</tr>
			{#each rows as row}
				<tr
					class="hover:bg-ctp-mantle"
					onclick={() => {
						goto(row.url);
					}}
				>
					{#each cols as col}
						<td class="text-center">{row[col]}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<th
					class="hover:bg-ctp-mantle"
					scope="row"
					colspan={cols.length}
					onclick={() => {
						goto(onnew);
					}}
				>
					<span class="material-icons-outlined text-gray-500 text-sm">add</span>
				</th>
			</tr>
		</tfoot>
	</table>
{/snippet}

<div
	class="grow p-4 pt-3
flex flex-col gap-3"
>
	<div
		class="
	justify-center
	justify-items-center
	flex
	flex-row flex-wrap"
	>
		<div
			class="
	justify-center
	justify-items-center
	hidden md:flex
	flex-row flex-wrap
  rounded-full border border-neutral-400 dark:border-neutral-600"
		>
			{@render button('sort', sort, () => {
				sort = !sort;
				sortfolders();
				sortfiles();
			})}
			{@render button('filter_list', false, () => {})}
		</div>
		<span class="grow"></span>
		<div
			class="
	justify-center
	justify-items-center
	hidden md:flex
	flex-row flex-wrap
  rounded-full border border-neutral-400 dark:border-neutral-600"
		>
			{@render button('grid_view', isview('grid'), setview('grid'))}
			{@render button('table_view', isview('table'), setview('table'))}
			{@render button('account_tree', isview('tree'), setview('tree'))}
		</div>
	</div>
	{#if isview('grid')}
		<div
			class="
	justify-center
	justify-items-center
	md:justify-start
	md:w-fit
	grid md:flex
	gap-5
	grid-cols-2
	flex-row flex-wrap"
		>
			{#each data.folders as folder}
				<a
					href="files/folder/{folder.id}"
					class="
bg-ctp-mantle
rounded-lg
flex justify-center items-center w-32 h-24"
				>
					<span class="material-icons-outlined"> folder </span>
				</a>
			{/each}

			{#each data.files as file}
				<a
					href="files/inspect/{file.id}"
					class="
bg-ctp-mantle
rounded-lg
flex justify-center items-center w-32 h-24 preview"
					style="background-image: url(files/file/{file.id}/get/preview);"
				>
					<span class="material-icons-outlined">
						{file.fileType.includes('image') ? 'image' : 'description'}
					</span>
				</a>
			{/each}

			<a
				href="files/upload"
				class="
bg-ctp-mantle
rounded-lg
flex justify-center items-center w-32 h-24"
			>
				<span class="material-icons-outlined"> upload_file </span>
			</a>
			<a
				href="files/group"
				class="
bg-ctp-mantle
rounded-lg
flex justify-center items-center w-32 h-24"
			>
				<span class="material-icons-outlined"> create_new_folder </span>
			</a>
		</div>
	{:else if isview('table')}
		<div class="grow flex flex-col gap-3 grow overflow-x-scroll">
			{@render table(
				['Folder', 'Size', 'Date Created', 'Date Modified', 'Date Viewed'],
				folders_,
				'http://localhost:5173/account/files/group'
			)}
			{@render table(
				['File', 'Size', 'Date Created', 'Date Modified', 'Date Viewed'],
				files_,
				'http://localhost:5173/account/files/upload'
			)}
		</div>
	{:else if isview('tree')}
		<div class="grow flex flex-col gap-3 grow overflow-x-scroll">tree:3c</div>
	{/if}
</div>

<style>
	.preview {
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}

	/* tr:nth-child(even) {
  	background: rgba(var(--ctp-mantle), var(--tw-bg-opacity, 0.5));
	} */
</style>
