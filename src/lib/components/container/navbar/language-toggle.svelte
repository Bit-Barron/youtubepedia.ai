<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { currentLang, languages, setLanguage } from '../../../store/language';

	const localeFlags = {
		en: '🇺🇸',
		de: '🇩🇪'
	};

	function toggleLanguage() {
		const newLang = $currentLang === 'en' ? 'de' : 'en';
		setLanguage(newLang);
	}
</script>

<Button variant="outline" on:click={toggleLanguage}>
	<span class="text-sm">{localeFlags[$currentLang as keyof typeof localeFlags]}</span>
	<span class="text-sm">
		{$currentLang === 'en' ? 'English' : 'Deutsch'}
	</span>
</Button>
