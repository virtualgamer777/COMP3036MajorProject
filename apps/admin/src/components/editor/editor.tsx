"use client"

import React, { useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@repo/db/data';
import { marked } from 'marked';


type FormValues = {
	title: string;
	description: string;
	content: string;
	tagList: string;
	imageUrl: string;
};

type EditorProps = {
  initialPost?: Post | null;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const MAX_DESCRIPTION_LENGTH = 200;

const isValidUrl = (value: string) => {
	try {
		const url = new URL(value);
		return ['http:', 'https:'].includes(url.protocol);
	} catch {
		return false;
	}
};

const validate = (values: FormValues): FormErrors => {
	const errors: FormErrors = {};

	if (!values.title.trim()) errors.title = 'Title is required.';
	if (!values.description.trim()) errors.description = 'Description is required.';
	if (values.description.length > MAX_DESCRIPTION_LENGTH) {
		errors.description = `Description is too long. Maximum is 200 characters`;
	}
	if (!values.content.trim()) errors.content = 'Content is required.';

	const tags = values.tagList
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean);

	if (!values.tagList.trim() || tags.length === 0) {
		errors.tagList = 'At least one tag is required.';
	}

	if (!values.imageUrl.trim()) {
		errors.imageUrl = 'Image URL is required.';
	} else if (!isValidUrl(values.imageUrl.trim())) {
		errors.imageUrl = 'This is not a valid URL';
	}

	return errors;
};

const renderMarkdown = (markdown: string) => {
	if (!markdown.trim()) {
		return '<em>No content</em>';
	}

	return marked.parse(markdown, { async: false });
};

export default function Editor({ initialPost = null }: EditorProps) {
	const router = useRouter();
	const normalizeDescription = (value?: string | null) =>
		(value ?? '')
			.replace(/^"(.*)"$/s, '$1')       // strips wrapping quotes if present
			.replace(/\s*\n\s*/g, ' ')        // collapse line breaks + indentation
			.replace(/\s{2,}/g, ' ')
			.trim();
	
	const [values, setValues] = useState<FormValues>({
		title: initialPost?.title ?? '',
		description: normalizeDescription(initialPost?.description) ?? '',
		content: initialPost?.content ?? '',
		tagList: initialPost?.tags ?? '',
		imageUrl: initialPost?.imageUrl ?? '',

	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [showPreview, setShowPreview] = useState(false);
	const [saveAttempted, setSaveAttempted] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);

	const contentRef = useRef<HTMLTextAreaElement | null>(null);
	const savedCursor = useRef<{ start: number; end: number } | null>(null);
	
	const previousShowPreview = useRef(showPreview);


	useLayoutEffect(() => {
	if (previousShowPreview.current && !showPreview) {
		const el = contentRef.current;
		const cursor = savedCursor.current;

		if (el && cursor) {
		el.focus();
		el.setSelectionRange(cursor.start, cursor.end);
		}
	}

	previousShowPreview.current = showPreview;
	}, [showPreview]);

	const handleChange =
		(field: keyof FormValues) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const next = { ...values, [field]: event.target.value };
			setValues(next);

			if (saveAttempted) {
				setErrors(validate(next));
			}
		};

	const togglePreview = () => {
		if (!showPreview) {
			const el = contentRef.current;
			if (el) {
				savedCursor.current = {
					start: el.selectionStart ?? 0,
					end: el.selectionEnd ?? 0,
				};
			}
			setShowPreview(true);
			return;
		}

		setShowPreview(false);
	};

	const handleSave = async (event: React.FormEvent) => {
		event.preventDefault();
		setSaveAttempted(true);
		setSaveError(null);

		const nextErrors = validate(values);
		setErrors(nextErrors);

		if (Object.keys(nextErrors).length === 0) {
			const response = await fetch('/api/updatePost', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			});

			console.log(response);

			if (!response.ok) {
				setSaveError('Unable to save post. Please try again.');
				return;
			}

			//router.push('/');
		}
		else {
			setSaveError("Please fix the errors before saving");
		}
		
	};

	const showError = (field: keyof FormValues) => saveAttempted && errors[field];

	return (
		<form
			onSubmit={handleSave}
			className="mx-auto grid w-full max-w-3xl gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
		>
			<div className="space-y-1">
			<h1 className="text-2xl font-semibold tracking-tight text-slate-900">Post Editor</h1>
			<p className="text-sm text-slate-600">Create and validate your post content before saving.</p>
			</div>

			<div className="grid gap-5">
			<div className="space-y-2">
				<label htmlFor="title" className="block text-sm font-medium text-slate-800">
				Title
				</label>
				<input
				id="title"
				type="text"
				value={values.title}
				onChange={handleChange("title")}
				className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
				/>
				{showError("title") && <p className="text-sm text-red-600">{errors.title}</p>}
			</div>

			<div className="space-y-2">
				<label htmlFor="description" className="block text-sm font-medium text-slate-800">
				Description
				</label>
				<textarea
				id="description"
				value={values.description}
				onChange={handleChange("description")}
				rows={3}
				className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
				/>
				<div className="flex items-center justify-between">
				<small className="text-xs text-slate-500">
					{values.description.length}/{MAX_DESCRIPTION_LENGTH}
				</small>
				</div>
				{showError("description") && <p className="text-sm text-red-600">{errors.description}</p>}
			</div>

			<div className="space-y-2">
				<div className="flex items-center justify-between">
				<label htmlFor="content" className="block text-sm font-medium text-slate-800">
					Content (Markdown)
				</label>
				<button
					type="button"
					onClick={togglePreview}
					className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
				>
					{showPreview ? "Close Preview" : "Preview"}
				</button>
				</div>

				{!showPreview ? (
				<textarea
					id="content"
					ref={contentRef}
					value={values.content}
					onChange={handleChange("content")}
					rows={12}
					className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
				/>
				) : (
				<div
					data-test-id="content-preview"
					className="prose max-w-none min-h-52 rounded-lg border border-slate-300 bg-slate-50 p-4"
				>
					<div dangerouslySetInnerHTML={{ __html: renderMarkdown(values.content) }} />
				</div>
				)}

				{showError("content") && <p className="text-sm text-red-600">{errors.content}</p>}
			</div>

			<div className="grid gap-5 md:grid-cols-2">
				<div className="space-y-2">
				<label htmlFor="Tags" className="block text-sm font-medium text-slate-800">
					Tags
				</label>
				<input
					id="Tags"
					type="text"
					value={values.tagList}
					onChange={handleChange("tagList")}
					className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
				/>
				{showError("tagList") && <p className="text-sm text-red-600">{errors.tagList}</p>}
				</div>

				<div className="space-y-2">
				<label htmlFor="imageUrl" className="block text-sm font-medium text-slate-800">
					Image URL
				</label>
				<input
					id="imageUrl"
					type="url"
					value={values.imageUrl}
					onChange={handleChange("imageUrl")}
					className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
				/>
				{showError("imageUrl") && <p className="text-sm text-red-600">{errors.imageUrl}</p>}
				</div>
			</div>

			<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
				<p className="mb-2 text-sm font-medium text-slate-700">Image Review</p>
				{isValidUrl(values.imageUrl.trim()) ? (
				<img 
					data-test-id="image-preview"
					src={values.imageUrl.trim()}
					alt="Review"
					className="max-h-64 w-full rounded-lg border border-slate-200 object-cover"
				/>
				) : (
				<p className="text-sm text-slate-500">Enter a valid image URL to review.</p>
				)}
			</div>
			</div>

			<div className="flex justify-end">
			<button
				type="submit"
				className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
			>
				Save
			</button>
			</div>
			{saveError ? <p className="text-sm text-red-600">{saveError}</p> : null}
		</form>
	);

}