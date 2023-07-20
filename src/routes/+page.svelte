<script lang="ts">
    const links = [
        {
            url: "/account",
            name: "Continue",
            icon: "account_circle",
        },
        {
            url: "/docs",
            name: "Documentation",
            icon: "description",
        },
        {
            url: "/source",
            name: "Source Code",
            icon: "code",
        },
        {
            url: "http://thefireflyer.me/homeportal/",
            name: "Other apps",
            icon: "apps",
        },
    ]
</script>

<div class="grow p-3
flex flex-col
items-center gap-3">
    <h1 class="text-4xl">OpenCloud</h1>
    <h2 class="text-3xl text-neutral-700 dark:text-neutral-300">Your Online Garden</h2>
    {#each links as link}
    <a href={link.url} class="w-80
    border rounded-full border-neutral-500 hover:bg-neutral-200 hover:dark:bg-neutral-800
    p-1 px-2 flex items-stretch gap-2">
        <span class="material-icons-outlined text-3xl">{link.icon}</span>
        <span class="text-2xl">{link.name}</span>
    </a>
    {/each}
</div>