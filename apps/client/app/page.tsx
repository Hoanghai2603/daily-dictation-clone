import Link from 'next/link';

// Detailed mock data to match the visual weight of the reference
const topics = [
  {
    id: 'short-stories',
    title: 'Short Stories',
    count: 120,
    level: 'Easy',
    thumb: 'https://dailydictation.com/public/img/thumb/short-stories.jpg'
  },
  {
    id: 'conversations',
    title: 'English Conversations',
    count: 85,
    level: 'Easy/Intermediate',
    thumb: 'https://dailydictation.com/public/img/thumb/english-conversations.jpg'
  },
  {
    id: 'stories-for-kids',
    title: 'Stories for Kids',
    count: 55,
    level: 'Easy',
    thumb: 'https://dailydictation.com/public/img/thumb/stories-for-kids.jpg'
  },
  {
    id: 'toeic',
    title: 'TOEIC Listening',
    count: 180,
    level: 'Intermediate/Advanced',
    thumb: 'https://dailydictation.com/public/img/thumb/toeic.jpg'
  },
  {
    id: 'ielts',
    title: 'IELTS Listening',
    count: 200,
    level: 'Advanced',
    thumb: 'https://dailydictation.com/public/img/thumb/ielts-listening.jpg'
  },
  {
    id: 'toefl',
    title: 'TOEFL Listening',
    count: 150,
    level: 'Advanced',
    thumb: 'https://dailydictation.com/public/img/thumb/toefl-listening.jpg'
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[1140px] px-3 md:px-[15px] py-4">
      <div className="mb-4">
        <h1 className="text-[#212529] font-medium text-[29.6px] leading-[1.2] mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          All topics
        </h1>
        <div className="text-[#6c757d]">
          Practice English listening skills with dictation exercises.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {topics.map((topic) => (
          <Link
            href={`/topic/${topic.id}`}
            key={topic.id}
            className="flex bg-white border border-[#dee2e6] rounded-[6px] p-0 overflow-hidden hover:no-underline shadow-[0_2px_4px_rgba(0,0,0,0.075)] transition-shadow hover:shadow-md"
          >
            <div className="flex w-full p-4">
              {/* Thumbnail Placeholder */}
              <div className="flex-shrink-0 mr-4">
                <div className="w-[90px] h-[90px] bg-gray-200 rounded-[6px] border border-gray-200 p-1 flex items-center justify-center text-xs text-gray-400">
                  IMG
                </div>
              </div>

              <div className="flex-grow flex flex-col justify-center">
                <h2 className="text-[#0d6efd] text-[23.2px] font-normal leading-tight mb-1 hover:underline decoration-2">
                  {topic.title}
                </h2>
                <div className="text-[#6c757d] text-[16px]">
                  <span className="mr-3">{topic.count} exercises</span>
                  {topic.level && (
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-200">
                      {topic.level}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
