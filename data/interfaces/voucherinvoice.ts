import { NextResponse } from 'next/server';
import { queryD1First, queryD1 } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';

// Define VoucherInvoiceInterface (assuming it exists in D1)
// interfaces.VoucherInvoiceInterface.dataClass = VoucherInvoice
/*
function VoucherInvoiceInterface?(this: VoucherInvoiceClass)
{
   this.dataClass = VoucherInvoice;
   this.objectType = 'VOUCHER_INVOICE';
}
*/
