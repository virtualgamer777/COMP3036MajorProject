import { getPosts, appendPost, upsertPost } from '@repo/db/data';
import { toUrlPath } from '@repo/utils/url';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

//post
type UpsertPostPayload = {
  id?: number;
  urlId?: string;
  title: string;
  category: string;
  description: string;
  content: string;
  tagList: string;
  imageUrl: string;
};

//redefine here for route
type FormErrors = Partial<Record<keyof UpsertPostPayload, string>>;


//don't judge me
const MAX_DESCRIPTION_LENGTH = 200;

//redefined here for use
function isValidUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return ['http:', 'https:'].includes(url.protocol);
	} catch {
		return false;
	}
};

//rewrite of validate to work server side
function validate(values: Partial<UpsertPostPayload>): FormErrors {
    const errors: FormErrors = {};

    const title = values.title?.trim() ?? '';
    const category = values.category?.trim() ?? '';
    const description = values.description?.trim() ?? '';
    const content = values.content?.trim() ?? '';
    const tagList = values.tagList?.trim() ?? '';
    const imageUrl = values.imageUrl?.trim() ?? '';

    // make sure values exist
    if (!title) errors.title = 'Title is required.';
    if (!category) errors.category = 'Category is required.';
    if (!description) errors.description = 'Description is required.';
    if (description.length > MAX_DESCRIPTION_LENGTH) {
        errors.description = `Description is too long. Maximum is ${MAX_DESCRIPTION_LENGTH} characters`;
    }
    if (!content) errors.content = 'Content is required.';

    // get tags & split them up
    const tags = tagList.split(',').map((t) => t.trim()).filter(Boolean);

    // make sure there is a tag
    if (!tagList || tags.length === 0) {
        errors.tagList = 'At least one tag is required.';
    }

    // ensure image exists and has a valid url
    if (!imageUrl) {
        errors.imageUrl = 'Image URL is required.';
    } else if (!isValidUrl(imageUrl)) {
        errors.imageUrl = 'This is not a valid URL';
    }

    return errors;
}

const isNonEmpty = (value: unknown): value is string =>
	typeof value === 'string' && value.trim().length > 0;

export async function POST(request: Request) {
	const posts = await getPosts();
	
	const initialPayload = (await request.json()) as Partial<UpsertPostPayload>;
	//make sure it's a valid submission
	const errors = validate(initialPayload);
	if(Object.keys(errors).length > 0) {
		return NextResponse.json(
			{
				error: 'Invalid post payload.',
				fieldErrors: errors,
			},
			{ status: 400}
		);
	}
	
	const payload = { ...initialPayload, urlId: initialPayload.urlId?.trim() ?? '', title: (initialPayload.title ?? '').trim(), category: (initialPayload.category ?? '').trim(), description: (initialPayload.description ?? '').trim(), content: (initialPayload.content ?? '').trim(), tagList: (initialPayload.tagList ?? '').trim(), imageUrl: (initialPayload.imageUrl ?? '').trim() } as UpsertPostPayload;

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
			category: payload.category.trim() || existingPost.category,
			description: payload.description.trim(),
			content: payload.content.trim(),
			imageUrl: payload.imageUrl.trim(),
			tags: normalizedTags,
		};
		//update existing post
		//posts[existingIndex] = updatedPost;
		await upsertPost(updatedPost);
		revalidatePath('/');
		return NextResponse.json({ mode: 'updated', post: updatedPost }, { status: 200 });
	}

	//create new post
	const nextId = posts.length ? Math.max(...posts.map((post) => post.id)) + 1 : 1;
	const newPost = {
		id: nextId,
		urlId: normalizedUrlId,
		title: payload.title.trim(),
		category: payload.category.trim(),
		description: payload.description.trim(),
		content: payload.content.trim(),
		imageUrl: payload.imageUrl.trim(),
		date: new Date(),
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
