<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { Globe } from 'lucide-svelte';
	import { locale, t } from 'svelte-i18n';

	const languages = [
		{ code: 'en', label: 'English' },
		{ code: 'de', label: 'Deutsch' }
	];

	function setLocale(code: string) {
		locale.set(code);
	}
</script>

<DropdownMenu>
	<DropdownMenuTrigger asChild>
		<Button variant="ghost" size="icon" class="h-9 w-9">
			<Globe class="h-4 w-4" />
			<span class="sr-only">{$t('common.toggle_language')}</span>
		</Button>
	</DropdownMenuTrigger>
	<DropdownMenuContent align="end">
		{#each languages as { code, label }}
			<DropdownMenuItem on:click={() => setLocale(code)}>
				<span class:font-bold={$locale === code}>{label}</span>
			</DropdownMenuItem>
		{/each}
	</DropdownMenuContent>
</DropdownMenu>
