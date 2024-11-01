<script lang="ts">
	import { Home, DollarSign, Mail, LogIn, LogOut, Menu } from 'lucide-svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import { Separator } from '$lib/components/ui/separator';
	import ThemeProvider from '$lib/components/container/navbar/theme-toggle.svelte';
	import LanguageToggle from './navbar/language-toggle.svelte';
	import { _ } from 'svelte-i18n';

	export let data;

	async function handleLogout() {
		const response = await fetch('/api/auth/logout', {
			method: 'POST'
		});

		if (response.ok) {
			await invalidateAll();
			goto('/');
		}
	}
</script>

<header class="border-b">
	<div class="container mx-auto flex h-16 items-center justify-between px-4">
		<div class="flex items-center space-x-4">
			<a href="/" class="text-2xl font-bold">Youtubepedia</a>
			{#if data.user}
				<a href="/dashboard/chat/" class="text-sm text-muted-foreground">{$_('recent-chats')}</a>
			{/if}
		</div>

		<div class="hidden items-center space-x-4 md:flex">
			{#if data.user}
				<span class="text-sm text-muted-foreground">{data.user.email}</span>
				<ThemeProvider />
				<LanguageToggle />
				<Button variant="destructive" on:click={handleLogout}>
					<LogOut class="mr-2 h-4 w-4" />
					{$_('logout')}
				</Button>
			{:else}
				<ThemeProvider />
				<LanguageToggle />

				<Button variant="default" href="/login">
					<LogIn class="mr-2 h-4 w-4" />
					{$_('login')}
				</Button>
			{/if}
		</div>

		<Sheet>
			<SheetTrigger class="md:hidden">
				<Button variant="ghost" size="icon">
					<Menu class="h-6 w-6" />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Youtubepedia</SheetTitle>
				</SheetHeader>
				<div class="grid gap-4 py-4">
					<Button variant="ghost" href="/" class="w-full justify-start">
						<Home class="mr-2 h-4 w-4" />
						{$_('home')}
					</Button>
					<Button variant="ghost" href="/pricing" class="w-full justify-start">
						<DollarSign class="mr-2 h-4 w-4" />
						{$_('pricing')}
					</Button>
					<Button variant="ghost" href="/contact" class="w-full justify-start">
						<Mail class="mr-2 h-4 w-4" />
						{$_('contact')}
					</Button>

					<Separator />

					{#if data.user}
						<span class="px-4 text-sm text-muted-foreground">{data.user.email}</span>
						<Button variant="destructive" on:click={handleLogout} class="w-full">
							<LogOut class="mr-2 h-4 w-4" />
							{$_('logout')}
						</Button>
					{:else}
						<Button variant="default" href="/login" class="w-full">
							<LogIn class="mr-2 h-4 w-4" />
							{$_('login')}
						</Button>
					{/if}
				</div>
			</SheetContent>
		</Sheet>
	</div>
</header>
