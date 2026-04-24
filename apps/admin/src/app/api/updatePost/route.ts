import { getPosts, appendPost } from '@repo/db/data';
import { toUrlPath } from '@repo/utils/url';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

//post
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
	const posts = await getPosts();
	
	const payload = (await request.json()) as Partial<UpsertPostPayload>;
	//make sure it's a valid submission
	if (
		!isNonEmpty(payload.title) ||
		!isNonEmpty(payload.description) ||
		!isNonEmpty(payload.content) ||
		!isNonEmpty(payload.tagList) ||
		!isNonEmpty(payload.imageUrl)
	) {
		return NextResponse.json({ error: 'Invalid post payload.' }, { status: 400 });
	}
	//if provided, post already exists
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

	//fix tags (just in case)
	const normalizedTags = payload.tagList
		.split(',')
		.map((tag) => tag.trim())
		.filter(Boolean)
		.join(',');

	//if updating
	if (exists) {
		//get existing post
		const existingPost = posts.find((post) => normalizedUrlId === post.urlId);

		//get index of existing post
		const existingIndex = posts.findIndex(
    		(post) => post.urlId === normalizedUrlId
		);

		//failed
		if (!existingPost) {
			return NextResponse.json({ error: 'Post lookup failed.' }, { status: 500 });
		}
		//create temp post item
		const updatedPost = {
			...existingPost,
			urlId: normalizedUrlId,
			title: payload.title.trim(),
			description: payload.description.trim(),
			content: payload.content.trim(),
			imageUrl: payload.imageUrl.trim(),
			tags: normalizedTags,
		};
		//update existing post
		posts[existingIndex] = updatedPost;
		revalidatePath('/');
		return NextResponse.json({ mode: 'updated', post: updatedPost }, { status: 200 });
	}

	//create new post
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

	//apend post to end
	appendPost(newPost);

	// console.log('Posts array length AFTER:', posts.length);
    // console.log('New post added:', newPost);
	//make sure it shows up
	revalidatePath('/');

	return NextResponse.json({ mode: 'created', post: newPost }, { status: 201 });
}
