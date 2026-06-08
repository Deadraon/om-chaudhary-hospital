import { queryD1 } from '@/lib/d1';
import InventoryClient from './InventoryClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Ward & OT Inventory Manager | Om Chaudhary Hospital',
};

export default async function InventoryPage() {
  let beds = [];

  try {
    beds = await queryD1('SELECT * FROM hospital_beds ORDER BY ward_name ASC, bed_number ASC');
  } catch (error) {
    console.error('Failed to load beds data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Ward & Bed Occupancy Manager</h2>
        <p className="text-gray-500 text-xs mt-0.5">Real-time status tracking for clinical bed allocations, ICU, and Emergency trauma wards.</p>
      </div>

      <InventoryClient initialBeds={beds} />
    </div>
  );
}
