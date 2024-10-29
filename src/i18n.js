import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));
register('es', () => import('./locales/de.json'));

init({
	fallbackLocale: 'en',
	initialLocale: getLocaleFromNavigator()
});
