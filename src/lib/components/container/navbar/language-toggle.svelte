<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { currentLang, setLanguage } from '@/store/language';

	type LocaleKey = 'en' | 'de';

	const localeFlags: Record<LocaleKey, string> = {
		en: '🇺🇸',
		de: '🇩🇪'
	};

	function toggleLanguage() {
		const newLang = $currentLang === 'en' ? 'de' : 'en';
		setLanguage(newLang as LocaleKey);
	}
</script>

<Button variant="outline" on:click={toggleLanguage} class="p-2">
	<span class="text-lg">
		{localeFlags[$currentLang as LocaleKey]}
	</span>
</Button>
