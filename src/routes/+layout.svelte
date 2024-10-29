<script>
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import '../i18n.js';
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<ModeWatcher />

<Toaster richColors position="top-right" />
<slot></slot>
