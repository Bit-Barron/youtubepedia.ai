<script lang="ts">
	import Navbar from '$lib/components/container/navbar/navbar.svelte';
	export let data;
</script>

<Navbar {data} />
<slot></slot>
