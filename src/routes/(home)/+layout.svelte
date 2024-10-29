<script lang="ts">
	import Navbar from '$lib/components/container/navbar/header.svelte';
	export let data;
</script>

<Navbar {data} />
<slot></slot>
