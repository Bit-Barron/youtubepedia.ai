import { browser } from '$app/environment';
import '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	if (browser) {
		const savedLang = localStorage.getItem('language');
		if (savedLang) {
			locale.set(savedLang);
		} else {
			locale.set(window.navigator.language);
		}
	}
	await waitLocale();
};
