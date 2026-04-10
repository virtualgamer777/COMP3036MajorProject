import { NextRequest, NextResponse } from 'next/server';
import { reset } from '@repo/db/data';

export async function POST(request: NextRequest) {
	try {
		reset();
		// Reset posts in your database
		// Example: await db.post.deleteMany({});
		// Or: await db.post.updateMany({}, { $set: { /* reset fields */ } });
		
		return NextResponse.json(
			{ message: 'Posts reset successfully' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to reset posts' },
			{ status: 500 }
		);
	}
}