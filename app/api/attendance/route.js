import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// Helper to get Indian Standard Time (IST) Date and Time strings
function getISTDateAndTime() {
  const optionsDate = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatterDate = new Intl.DateTimeFormat('en-CA', optionsDate); // Outputs: YYYY-MM-DD
  const dateStr = formatterDate.format(new Date());

  const optionsTime = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const formatterTime = new Intl.DateTimeFormat('en-US', optionsTime);
  const timeStr = formatterTime.format(new Date());

  return { dateStr, timeStr };
}

// Self-healing database initialization helper
async function ensureAttendanceTable() {
  await queryD1(`
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      check_in TEXT,
      check_out TEXT,
      status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'half_day', 'on_leave')),
      notes TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, date)
    )
  `);
}

/**
 * GET: Retrieve attendance history or today's status
 */
export async function GET(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currentUser.role === 'patient') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await ensureAttendanceTable();

    const { searchParams } = new URL(request.url);
    const todayOnly = searchParams.get('today') === 'true';

    const { dateStr } = getISTDateAndTime();

    // 1. Fetching status of today for check-in widget
    if (todayOnly) {
      const record = await queryD1First(
        'SELECT * FROM attendance WHERE user_id = ? AND date = ?',
        [currentUser.userId, dateStr]
      );
      if (record) {
        return NextResponse.json({
          checkedIn: true,
          checkInTime: record.check_in,
          checkOutTime: record.check_out,
          status: record.status,
          notes: record.notes,
        });
      } else {
        return NextResponse.json({ checkedIn: false });
      }
    }

    // 2. Fetching list of attendance logs
    if (currentUser.role === 'super_admin') {
      // Management can view all staff / doctors logs
      const filterDate = searchParams.get('date'); // YYYY-MM-DD
      const filterUserId = searchParams.get('userId');

      let query = `
        SELECT a.*, u.name AS user_name, u.role AS user_role, u.email AS user_email
        FROM attendance a
        LEFT JOIN users u ON a.user_id = u.id
      `;
      const params = [];

      if (filterDate && filterUserId) {
        query += ' WHERE a.date = ? AND a.user_id = ?';
        params.push(filterDate, filterUserId);
      } else if (filterDate) {
        query += ' WHERE a.date = ?';
        params.push(filterDate);
      } else if (filterUserId) {
        query += ' WHERE a.user_id = ?';
        params.push(filterUserId);
      }

      query += ' ORDER BY a.date DESC, a.check_in DESC';

      const logs = await queryD1(query, params);
      return NextResponse.json(logs);
    } else {
      // Regular staff / doctors can only view their own logs
      const logs = await queryD1(`
        SELECT a.*, u.name AS user_name, u.role AS user_role, u.email AS user_email
        FROM attendance a
        LEFT JOIN users u ON a.user_id = u.id
        WHERE a.user_id = ?
        ORDER BY a.date DESC
      `, [currentUser.userId]);
      return NextResponse.json(logs);
    }
  } catch (error) {
    console.error('GET Attendance API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST: Record Check-In, Check-Out, or Admin manually logging attendance
 */
export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currentUser.role === 'patient') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await ensureAttendanceTable();

    const body = await request.json();
    const { action, userId, date, checkIn, checkOut, status, notes } = body;

    const { dateStr, timeStr } = getISTDateAndTime();

    if (action === 'check-in') {
      // Check if already checked in today
      const existing = await queryD1First(
        'SELECT id, status FROM attendance WHERE user_id = ? AND date = ?',
        [currentUser.userId, dateStr]
      );

      if (existing) {
        if (existing.status === 'on_leave' || existing.status === 'absent') {
          const cancelNotes = notes
            ? `${notes} (Leave/Absence cancelled - Checked in remotely)`
            : 'Leave/Absence cancelled - Checked in remotely';
          await queryD1(`
            UPDATE attendance
            SET check_in = ?, status = 'present', notes = ?
            WHERE id = ?
          `, [timeStr, cancelNotes, existing.id]);
          return NextResponse.json({ success: true, checkInTime: timeStr, status: 'present' });
        }
        return NextResponse.json({ error: 'Already checked in for today' }, { status: 400 });
      }

      const id = generateId();
      await queryD1(`
        INSERT INTO attendance (id, user_id, date, check_in, status, notes)
        VALUES (?, ?, ?, ?, 'present', ?)
      `, [id, currentUser.userId, dateStr, timeStr, notes || '']);

      return NextResponse.json({ success: true, checkInTime: timeStr, status: 'present' });
    } 
    
    if (action === 'check-out') {
      // Fetch today's record
      const record = await queryD1First(
        'SELECT id, check_in, check_out FROM attendance WHERE user_id = ? AND date = ?',
        [currentUser.userId, dateStr]
      );

      if (!record) {
        return NextResponse.json({ error: 'You must check in first before checking out' }, { status: 400 });
      }

      if (record.check_out) {
        return NextResponse.json({ error: 'Already checked out for today' }, { status: 400 });
      }

      await queryD1(`
        UPDATE attendance
        SET check_out = ?
        WHERE id = ?
      `, [timeStr, record.id]);

      return NextResponse.json({ success: true, checkOutTime: timeStr });
    }

    if (action === 'admin-update') {
      // Requires super_admin role
      if (currentUser.role !== 'super_admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      if (!userId || !date || !status) {
        return NextResponse.json({ error: 'Missing parameters (userId, date, status)' }, { status: 400 });
      }

      // Check if entry already exists for this user on this date
      const record = await queryD1First(
        'SELECT id FROM attendance WHERE user_id = ? AND date = ?',
        [userId, date]
      );

      if (record) {
        // Update existing record
        await queryD1(`
          UPDATE attendance
          SET check_in = ?, check_out = ?, status = ?, notes = ?
          WHERE id = ?
        `, [checkIn || null, checkOut || null, status, notes || '', record.id]);
      } else {
        // Create new record
        const newId = generateId();
        await queryD1(`
          INSERT INTO attendance (id, user_id, date, check_in, check_out, status, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [newId, userId, date, checkIn || null, checkOut || null, status, notes || '']);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('POST Attendance API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
