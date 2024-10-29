import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { locale } from 'svelte-i18n';

export const languages = [
	{ code: 'de', name: 'Deutsch' },
	{ code: 'en', name: 'English' }
];

export const currentLang = writable((browser && localStorage.getItem('language')) || 'en');

export function setLanguage(lang: string) {
	if (browser) {
		localStorage.setItem('language', lang);
		locale.set(lang);
		currentLang.set(lang);
	}
}
