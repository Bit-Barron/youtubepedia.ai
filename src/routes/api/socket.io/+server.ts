import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return new Response(undefined, { status: 101 });
};

export const POST: RequestHandler = async () => {
	return new Response(undefined, { status: 101 });
};