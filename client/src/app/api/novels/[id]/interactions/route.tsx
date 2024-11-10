// app/api/novels/[id]/interactions/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Novel from '@/models/Novel';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { action } = await req.json();
    const novelId = params.id;
    const userId = session.user.id;

    const novel = await Novel.findById(novelId);
    if (!novel) {
      return NextResponse.json({ error: 'Novel not found' }, { status: 404 });
    }

    switch (action) {
      case 'view':
        novel.viewCount += 1;
        break;
      
      case 'like':
        const isLiked = novel.likes.includes(userId);
        if (isLiked) {
          novel.likes = novel.likes.filter(id => id.toString() !== userId);
        } else {
          novel.likes.push(userId);
        }
        break;
      
      case 'bookshelf':
        const inBookshelf = novel.bookshelf.includes(userId);
        if (inBookshelf) {
          novel.bookshelf = novel.bookshelf.filter(id => id.toString() !== userId);
        } else {
          novel.bookshelf.push(userId);
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await novel.save();

    return NextResponse.json({
      viewCount: novel.viewCount,
      likeCount: novel.likes.length,
      bookshelfCount: novel.bookshelf.length,
      isLiked: novel.likes.includes(userId),
      inBookshelf: novel.bookshelf.includes(userId)
    });

  } catch (error) {
    console.error('Error processing interaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}