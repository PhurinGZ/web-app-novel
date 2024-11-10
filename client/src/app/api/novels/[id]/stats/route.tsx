// app/api/novels/[id]/stats/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Novel from '@/models/Novel';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();
    
    const novel = await Novel.findById(params.id)
      .populate('reviews')
      .select('viewCount likes bookshelf reviews');

    if (!novel) {
      return NextResponse.json({ error: 'Novel not found' }, { status: 404 });
    }

    const stats = {
      viewCount: novel.viewCount,
      likeCount: novel.likes.length,
      bookshelfCount: novel.bookshelf.length,
      reviewCount: novel.reviews.length,
    };

    if (session?.user?.id) {
      stats['isLiked'] = novel.likes.includes(session.user.id);
      stats['inBookshelf'] = novel.bookshelf.includes(session.user.id);
    }

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching novel stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}