<script>
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import Header from '$lib/components/container/header.svelte';
	export let data;
</script>

<ModeWatcher />
<Header {data} />
<Toaster richColors position="top-right" />
<slot></slot>
