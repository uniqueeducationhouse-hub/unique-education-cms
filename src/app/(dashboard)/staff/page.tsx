'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Receipt,
  Search,
  Filter,
  Briefcase,
  CheckCircle2,
  Clock,
  Printer,
  Edit,
  Trash2,
  Banknote,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useSchoolSettings } from '@/lib/school-settings';
import { createClient } from '@/lib/supabase/client';
import {
  type StaffMember,
  type PayrollVoucher,
  type StaffCategory,
  DEFAULT_STAFF_MEMBERS,
  loadPayrollVouchers,
  savePayrollVouchers,
} from '@/lib/staff-store';
import { AddStaffModal } from '@/components/staff/AddStaffModal';
import { ProcessPayrollModal } from '@/components/staff/ProcessPayrollModal';
import { PrintableSalarySlip } from '@/components/staff/PrintableSalarySlip';

export default function StaffPayrollPage() {
  const { settings } = useSchoolSettings();
  const [activeTab, setActiveTab] = useState<'directory' | 'payroll'>('directory');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [payrollVouchers, setPayrollVouchers] = useState<PayrollVoucher[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const supabase = createClient();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [processingStaff, setProcessingStaff] = useState<StaffMember | null>(null);
  const [viewingVoucher, setViewingVoucher] = useState<PayrollVoucher | null>(null);

  useEffect(() => {
    async function fetchStaffFromSupabase() {
      try {
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0 && !error) {
          setStaffList(data as StaffMember[]);
        } else {
          // Seed defaults if empty
          for (const member of DEFAULT_STAFF_MEMBERS) {
            await supabase.from('staff').upsert(member, { onConflict: 'id' });
          }
          setStaffList(DEFAULT_STAFF_MEMBERS);
        }
      } catch (err) {
        console.warn('Failed to load staff from Supabase, using defaults', err);
        setStaffList(DEFAULT_STAFF_MEMBERS);
      }

      setPayrollVouchers(loadPayrollVouchers());
      setIsLoaded(true);
    }

    fetchStaffFromSupabase();
  }, [supabase]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Staff CRUD with Supabase
  const handleSaveStaff = async (member: StaffMember) => {
    let updated: StaffMember[];
    const exists = staffList.some((s) => s.id === member.id);
    if (exists) {
      updated = staffList.map((s) => (s.id === member.id ? member : s));
      showToast(`Staff profile for ${member.first_name} ${member.last_name} updated successfully!`);
    } else {
      updated = [member, ...staffList];
      showToast(`Successfully onboarded ${member.first_name} ${member.last_name} (${member.employee_id})!`);
    }
    setStaffList(updated);

    try {
      const { error } = await supabase.from('staff').upsert(member, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase staff upsert error:', error.message);
      }
    } catch (err) {
      console.error('Failed to save staff member to Supabase', err);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    const updated = staffList.filter((s) => s.id !== id);
    setStaffList(updated);
    showToast('Staff member removed.');

    try {
      const { error } = await supabase.from('staff').delete().eq('id', id);
      if (error) {
        console.warn('Supabase staff delete error:', error.message);
      }
    } catch (err) {
      console.error('Failed to delete staff member from Supabase', err);
    }
  };

  // Payroll save
  const handleSavePayroll = (voucher: PayrollVoucher) => {
    const updated = [voucher, ...payrollVouchers];
    setPayrollVouchers(updated);
    savePayrollVouchers(updated);
    showToast(`Salary slip ${voucher.slip_number} saved for ${voucher.staff_name}!`);
    setViewingVoucher(voucher);
  };

  // Quick mark voucher paid
  const handleTogglePaid = (voucherId: string) => {
    const updated = payrollVouchers.map((v) => {
      if (v.id === voucherId) {
        const nextStatus = v.payment_status === 'paid' ? 'unpaid' : 'paid';
        return {
          ...v,
          payment_status: nextStatus as 'paid' | 'unpaid',
          payment_method: nextStatus === 'paid' ? ('bank_transfer' as const) : undefined,
          payment_date: nextStatus === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
          receipt_number: nextStatus === 'paid' ? `PRCP-2026-${Math.floor(100 + Math.random() * 900)}` : undefined,
        };
      }
      return v;
    });
    setPayrollVouchers(updated);
    savePayrollVouchers(updated);
    showToast('Payroll payment status updated!');
  };

  // Filter staff
  const filteredStaff = staffList.filter((s) => {
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.first_name.toLowerCase().includes(q) ||
      s.last_name.toLowerCase().includes(q) ||
      s.employee_id.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.qualification.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Filter payroll
  const filteredPayroll = payrollVouchers.filter((v) => {
    const q = searchQuery.toLowerCase();
    return (
      v.staff_name.toLowerCase().includes(q) ||
      v.slip_number.toLowerCase().includes(q) ||
      v.employee_id.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q)
    );
  });

  // KPI Calculations
  const totalStaffCount = staffList.length;
  const activeStaffCount = staffList.filter((s) => s.status === 'active').length;
  const totalMonthlyBasic = staffList.reduce((sum, s) => sum + (s.basic_salary || 0), 0);
  const totalPaidThisMonth = payrollVouchers
    .filter((v) => v.payment_status === 'paid')
    .reduce((sum, v) => sum + (v.net_salary || 0), 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 uppercase tracking-wider">
              HR &amp; Payroll Module
            </span>
            <span className="text-xs text-slate-500 font-medium">PKR Payroll &amp; Staff Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Staff Directory &amp; Salary Disbursal</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage teachers, clerks, peons, guards, drivers, calculate monthly allowances/deductions, and print 2-copy salary slips.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingStaff(null);
              setIsAddStaffOpen(true);
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-200 transition-colors"
          >
            <UserPlus className="h-4 w-4" /> Add New Staff Member
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Staff</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalStaffCount}</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{activeStaffCount} Active Duty</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base Payroll Burden</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{formatCurrency(totalMonthlyBasic)}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Monthly basic salaries</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Banknote className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Disbursed This Month</p>
            <h3 className="text-xl font-black text-emerald-700 mt-0.5">{formatCurrency(totalPaidThisMonth)}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Paid via Bank / Cash</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Categories</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">7 Roles</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Teachers to Drivers</p>
          </div>
        </div>
      </div>

      {/* Tabs and Search Filter Bar */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'directory'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Staff Directory ({staffList.length})
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'payroll'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Salary Slips ({payrollVouchers.length})
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff or slip #..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            {activeTab === 'directory' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="Teacher">Teacher</option>
                <option value="Clerk">Clerk</option>
                <option value="Peon">Peon</option>
                <option value="Guard">Guard</option>
                <option value="Driver">Driver</option>
                <option value="Admin">Admin</option>
                <option value="Accountant">Accountant</option>
              </select>
            )}
          </div>
        </div>

        {/* TAB 1: STAFF DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-6">Staff Member &amp; ID</th>
                  <th className="py-3.5 px-6">Role / Category</th>
                  <th className="py-3.5 px-6">Phone &amp; Email</th>
                  <th className="py-3.5 px-6">Qualification</th>
                  <th className="py-3.5 px-6">Basic Salary</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                          {staff.first_name[0]}
                          {staff.last_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {staff.first_name} {staff.last_name}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">{staff.employee_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {staff.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-800">{staff.phone}</p>
                      <p className="text-[11px] text-slate-500">{staff.email || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{staff.qualification}</td>
                    <td className="py-4 px-6 font-bold text-emerald-700">
                      {formatCurrency(staff.basic_salary)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          staff.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : staff.status === 'on_leave'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {staff.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setProcessingStaff(staff)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1"
                        title="Process Monthly Salary Slip"
                      >
                        <Receipt className="h-3.5 w-3.5" /> Payroll
                      </button>
                      <button
                        onClick={() => {
                          setEditingStaff(staff);
                          setIsAddStaffOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStaff.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No staff members found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: MONTHLY SALARY SLIPS */}
        {activeTab === 'payroll' && (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-6">Slip # &amp; Month</th>
                  <th className="py-3.5 px-6">Staff Name &amp; ID</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Gross Salary</th>
                  <th className="py-3.5 px-6">Deductions</th>
                  <th className="py-3.5 px-6">Net Payable</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredPayroll.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-mono font-bold text-indigo-700">{voucher.slip_number}</p>
                      <p className="text-[11px] text-slate-500">{voucher.billing_month}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{voucher.staff_name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{voucher.employee_id}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 font-medium text-slate-800">
                        {voucher.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {formatCurrency(voucher.gross_salary)}
                    </td>
                    <td className="py-4 px-6 font-semibold text-red-600">
                      -{formatCurrency(voucher.total_deductions)}
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-700 text-sm">
                      {formatCurrency(voucher.net_salary)}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleTogglePaid(voucher.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-transform hover:scale-105 ${
                          voucher.payment_status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                        title="Click to toggle payment status"
                      >
                        {voucher.payment_status === 'paid'
                          ? `PAID (${voucher.payment_method?.replace('_', ' ').toUpperCase()})`
                          : 'PENDING UNPAID'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setViewingVoucher(voucher)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1"
                        title="Print 2-Copy Salary Slip"
                      >
                        <Printer className="h-3.5 w-3.5" /> Print Slip
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPayroll.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No payroll salary slips found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => {
          setIsAddStaffOpen(false);
          setEditingStaff(null);
        }}
        onSave={handleSaveStaff}
        editingMember={editingStaff}
      />

      <ProcessPayrollModal
        isOpen={Boolean(processingStaff)}
        onClose={() => setProcessingStaff(null)}
        staff={processingStaff}
        existingVouchers={payrollVouchers}
        onSavePayroll={handleSavePayroll}
      />

      <PrintableSalarySlip
        isOpen={Boolean(viewingVoucher)}
        onClose={() => setViewingVoucher(null)}
        voucher={viewingVoucher}
      />
    </div>
  );
}
