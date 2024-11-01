<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Avatar } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { MessageSquarePlus, Bot } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	export let data;

	const recentChats = data.chats.map((i) => {
		return {
			id: i.id,
			title: i.message,
			time: new Date(i.createdAt).toLocaleString('de-DE', {
				dateStyle: 'medium',
				timeStyle: 'short'
			}),
			status: i.type
		};
	});

	$: questionChats = recentChats.filter((i) => i.status === 'QUESTION');
</script>

<div class="min-h-screen">
	<div class="container mx-auto p-6">
		<div class="mb-8 flex items-center justify-between">
			<h2 class="text-2xl font-bold text-white">Kürzliche Chats</h2>
			<Button on:click={() => goto('/')} variant="outline" class="flex items-center gap-2">
				<MessageSquarePlus size={20} />
				Neuer Chat
			</Button>
		</div>

		<ul class="space-y-6">
			{#each questionChats as chat (chat.id)}
				<li class="rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition-all">
					<a href={`/dashboard/chat/${chat.id}`} class="flex items-start gap-4">
						<Avatar class="flex items-center justify-center border">
							<Bot class="text-slate-200" size={20} />
						</Avatar>
						<div class="flex-grow">
							<div class="flex items-start justify-between">
								<h3 class="text-lg font-semibold text-slate-200">{chat.title}</h3>
								<span class="text-xs text-slate-400">{chat.time}</span>
							</div>
							<div class="mt-2">
								<Badge
									variant={chat.status === 'QUESTION' ? 'secondary' : 'default'}
									class={chat.status === 'QUESTION'
										? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
										: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}
								>
									{chat.status === 'QUESTION' ? 'Frage' : 'Antwort'}
								</Badge>
							</div>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
