<script lang="ts">
	import { Check } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { plans } from '../../../utils/constants';
</script>

<div class="min-h-screen">
	<main class="container mx-auto px-4 py-16">
		<div class="mb-12 space-y-4 text-center">
			<h1 class="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
			<p class="text-xl text-muted-foreground">
				Unlock the power of video analysis with our flexible pricing options
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			{#each plans as plan}
				<Card class="relative">
					<CardHeader>
						<CardTitle>{plan.name}</CardTitle>
						<div class="mt-4 text-4xl font-bold">
							${plan.price}
							<span class="text-lg font-normal text-muted-foreground">/month</span>
						</div>
					</CardHeader>
					<CardContent>
						<ul class="mb-6 space-y-3">
							{#each plan.features as feature}
								<li class="flex items-center">
									<Check class="mr-2 h-5 w-5" />
									<span>{feature}</span>
								</li>
							{/each}
						</ul>
					</CardContent>
					<CardFooter>
						<Button variant="default" class="w-full">
							{plan.recommended ? 'Start Free Trial' : 'Choose Plan'}
						</Button>
					</CardFooter>
					{#if plan.recommended}
						<Badge class="absolute right-4 top-4">Recommended</Badge>
					{/if}
				</Card>
			{/each}
		</div>

		<div class="mt-16 space-y-4 text-center">
			<h2 class="text-2xl font-bold tracking-tight">Need a custom solution?</h2>
			<p class="text-muted-foreground">
				We offer tailored plans for large organizations and special use cases.
			</p>
			<Button variant="secondary" href="/contact">Contact Sales</Button>
		</div>
	</main>
</div>
