import SecondOpinionsClient from './SecondOpinionsClient';
import { queryD1 } from '@/lib/d1';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Second Opinion Requests | Hospital Portal',
};

export default async function SecondOpinionsPage() {
  let submissions = [];

  try {
    submissions = await queryD1(`
      SELECT * FROM second_opinions
      ORDER BY created_at DESC
    `);
  } catch (error) {
    console.error('Failed to load second opinions data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Second Opinion Inbox</h2>
        <p className="text-gray-500 text-xs mt-0.5">Review diagnostic report submissions, download attachments, and track follow-ups.</p>
      </div>

      <SecondOpinionsClient initialSubmissions={submissions} />
    </div>
  );
}
