<script lang="ts">
	import { currentLang, languages, setLanguage } from '../../../stores/language';

	const localeFlags = {
		en: '🇺🇸',
		de: '🇩🇪'
	};

	function toggleLanguage() {
		const newLang = $currentLang === 'en' ? 'de' : 'en';
		setLanguage(newLang);
	}
</script>

<button
	on:click={toggleLanguage}
	class="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-transparent px-3 py-1.5 hover:bg-slate-800"
>
	<span class="text-sm">{localeFlags[$currentLang as keyof typeof localeFlags]}</span>
	<span class="text-sm text-slate-200">
		{$currentLang === 'en' ? 'English' : 'Deutsch'}
	</span>
</button>
