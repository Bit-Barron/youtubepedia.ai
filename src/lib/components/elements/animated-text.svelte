<script lang="ts">
	import { onMount } from 'svelte';

	export let text: string;
	export let onComplete: () => void = () => {};

	let displayText = '';
	let currentIndex = 0;

	onMount(() => {
		const animateText = () => {
			if (currentIndex < text.length) {
				displayText += text[currentIndex];
				currentIndex++;
				setTimeout(animateText, 20);
			} else {
				onComplete();
			}
		};

		animateText();
	});
</script>

<span class="whitespace-pre-wrap">{displayText}<span class="animate-pulse">▊</span></span>
