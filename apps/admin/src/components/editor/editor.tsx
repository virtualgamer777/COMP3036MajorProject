"use client"

import React, { useMemo, useRef, useState } from 'react';
import Link from "next/link";
import { posts } from '@repo/db/data';
import { toUrlPath } from "@repo/utils/url";



type FormValues = {
	title: string;
	description: string;
	content: string;
	tagList: string;
	imageUrl: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const MAX_DESCRIPTION_LENGTH = 200;

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');

const markdownToHtml = (markdown: string) => {
	const safe = escapeHtml(markdown);

	return safe
		.replace(/^### (.*$)/gim, '<h3>$1</h3>')
		.replace(/^## (.*$)/gim, '<h2>$1</h2>')
		.replace(/^# (.*$)/gim, '<h1>$1</h1>')
		.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
		.replace(/\*(.*?)\*/gim, '<em>$1</em>')
		.replace(/`(.*?)`/gim, '<code>$1</code>')
		.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
		.replace(/\n/g, '<br />');
};

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
		errors.description = `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters.`;
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
		errors.imageUrl = 'Image URL must be a valid http/https URL.';
	}

	return errors;
};

export default function Editor() {
	const [values, setValues] = useState<FormValues>({
		title: '',
		description: '',
		content: '',
		tagList: '',
		imageUrl: '',
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [showPreview, setShowPreview] = useState(false);
	const [saveAttempted, setSaveAttempted] = useState(false);

	const contentRef = useRef<HTMLTextAreaElement | null>(null);
	const savedCursor = useRef<{ start: number; end: number } | null>(null);

	const renderedContent = useMemo(() => markdownToHtml(values.content), [values.content]);

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
		requestAnimationFrame(() => {
			const el = contentRef.current;
			const cursor = savedCursor.current;
			if (el && cursor) {
				el.focus();
				el.setSelectionRange(cursor.start, cursor.end);
			}
		});
	};

	const handleSave = (event: React.FormEvent) => {
		event.preventDefault();
		setSaveAttempted(true);

		const nextErrors = validate(values);
		setErrors(nextErrors);

		// Save action can be added here when no errors are present.
		if (Object.keys(nextErrors).length === 0) {
			const nextId = posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1;

			posts.push({
				id: nextId,
				urlId: toUrlPath(values.title),
				title: values.title.trim(),
				description: values.description.trim(),
				content: values.content.trim(),
				imageUrl: values.imageUrl.trim(),
				date: new Date(),
				category: "General",
				views: 0,
				likes: 0,
				tags: values.tagList
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean)
				.join(","),
				active: true,
			});
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
				maxLength={MAX_DESCRIPTION_LENGTH}
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
				<div className="prose max-w-none min-h-52 rounded-lg border border-slate-300 bg-slate-50 p-4">
					<div dangerouslySetInnerHTML={{ __html: renderedContent || "<em>No content</em>" }} />
				</div>
				)}

				{showError("content") && <p className="text-sm text-red-600">{errors.content}</p>}
			</div>

			<div className="grid gap-5 md:grid-cols-2">
				<div className="space-y-2">
				<label htmlFor="tags" className="block text-sm font-medium text-slate-800">
					Tag List (comma-separated)
				</label>
				<input
					id="tags"
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
				<p className="mb-2 text-sm font-medium text-slate-700">Image Preview</p>
				{isValidUrl(values.imageUrl.trim()) ? (
				<img
					src={values.imageUrl.trim()}
					alt="Preview"
					className="max-h-64 w-full rounded-lg border border-slate-200 object-cover"
				/>
				) : (
				<p className="text-sm text-slate-500">Enter a valid image URL to preview.</p>
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
		</form>
	);

}