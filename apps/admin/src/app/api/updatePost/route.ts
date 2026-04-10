import { getPosts, appendPost } from '@repo/db/data';
import { toUrlPath } from '@repo/utils/url';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

type UpsertPostPayload = {
	id?: number;
	urlId?: string;
	title: string;
	description: string;
	content: string;
	tagList: string;
	imageUrl: string;
};

const isNonEmpty = (value: unknown): value is string =>
	typeof value === 'string' && value.trim().length > 0;

export async function POST(request: Request) {
	const posts = getPosts();
	
	const payload = (await request.json()) as Partial<UpsertPostPayload>;

	if (
		!isNonEmpty(payload.title) ||
		!isNonEmpty(payload.description) ||
		!isNonEmpty(payload.content) ||
		!isNonEmpty(payload.tagList) ||
		!isNonEmpty(payload.imageUrl)
	) {
		return NextResponse.json({ error: 'Invalid post payload.' }, { status: 400 });
	}

	let exists = typeof payload.urlId === 'string' && payload.urlId.trim().length > 0;


	const normalizedUrlId = isNonEmpty(payload.urlId)
		? payload.urlId.trim()
		: toUrlPath(payload.title);

	// const existingIndex = posts.findIndex((post) => {
	// 	if (typeof payload.id === 'number') {
	// 		return post.id === payload.id;
	// 	}

	// 	return post.urlId === normalizedUrlId;
	// });

	const normalizedTags = payload.tagList
		.split(',')
		.map((tag) => tag.trim())
		.filter(Boolean)
		.join(',');


	if (exists) {
		const existingPost = posts.find((post) => normalizedUrlId === post.urlId);

		const existingIndex = posts.findIndex(
    		(post) => post.urlId === normalizedUrlId
		);

		if (!existingPost) {
			return NextResponse.json({ error: 'Post lookup failed.' }, { status: 500 });
		}

		const updatedPost = {
			...existingPost,
			urlId: normalizedUrlId,
			title: payload.title.trim(),
			description: payload.description.trim(),
			content: payload.content.trim(),
			imageUrl: payload.imageUrl.trim(),
			tags: normalizedTags,
		};

		posts[existingIndex] = updatedPost;
		revalidatePath('/');
		return NextResponse.json({ mode: 'updated', post: updatedPost }, { status: 200 });
	}

	const nextId = posts.length ? Math.max(...posts.map((post) => post.id)) + 1 : 1;
	const newPost = {
		id: nextId,
		urlId: normalizedUrlId,
		title: payload.title.trim(),
		description: payload.description.trim(),
		content: payload.content.trim(),
		imageUrl: payload.imageUrl.trim(),
		date: new Date(),
		category: 'General',
		views: 0,
		likes: 0,
		tags: normalizedTags,
		active: true,
	};

	// console.log('Posts array length BEFORE:', posts.length);
    // console.log('Payload received:', payload);

	appendPost(newPost);

	// console.log('Posts array length AFTER:', posts.length);
    // console.log('New post added:', newPost);
	revalidatePath('/');

	return NextResponse.json({ mode: 'created', post: newPost }, { status: 201 });
}
