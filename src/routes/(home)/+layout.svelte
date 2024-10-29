<script lang="ts">
	import Header from '$lib/components/container/header.svelte';

	export let data;
</script>

<Header {data} />
<slot></slot>
