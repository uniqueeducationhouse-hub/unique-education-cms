'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Briefcase, Phone, Mail, FileText, Calendar, Wallet } from 'lucide-react';
import { type StaffMember, type StaffCategory, type StaffStatus } from '@/lib/staff-store';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: StaffMember) => void;
  editingMember?: StaffMember | null;
}

export function AddStaffModal({ isOpen, onClose, onSave, editingMember }: AddStaffModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [category, setCategory] = useState<StaffCategory>('Teacher');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [qualification, setQualification] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [basicSalary, setBasicSalary] = useState<number>(45000);
  const [bankAccount, setBankAccount] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<StaffStatus>('active');

  useEffect(() => {
    if (editingMember) {
      setFirstName(editingMember.first_name);
      setLastName(editingMember.last_name);
      setEmployeeId(editingMember.employee_id);
      setCategory(editingMember.category);
      setPhone(editingMember.phone);
      setEmail(editingMember.email);
      setCnic(editingMember.cnic);
      setQualification(editingMember.qualification);
      setJoiningDate(editingMember.joining_date);
      setBasicSalary(editingMember.basic_salary);
      setBankAccount(editingMember.bank_account || '');
      setAddress(editingMember.address || '');
      setStatus(editingMember.status);
    } else {
      setFirstName('');
      setLastName('');
      setEmployeeId(`EMP-2026-${Math.floor(100 + Math.random() * 900)}`);
      setCategory('Teacher');
      setPhone('+92 3');
      setEmail('');
      setCnic('35201-');
      setQualification('B.Ed / M.A.');
      setJoiningDate(new Date().toISOString().split('T')[0]);
      setBasicSalary(45000);
      setBankAccount('Meezan Bank');
      setAddress('');
      setStatus('active');
    }
  }, [editingMember, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !employeeId) return;

    const member: StaffMember = {
      id: editingMember ? editingMember.id : `stf-${Date.now()}`,
      employee_id: employeeId,
      first_name: firstName,
      last_name: lastName,
      category,
      phone,
      email,
      cnic,
      qualification,
      joining_date: joiningDate,
      basic_salary: Number(basicSalary),
      bank_account: bankAccount,
      address,
      status,
      created_at: editingMember?.created_at || new Date().toISOString(),
    };

    onSave(member);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <UserPlus className="h-6 w-6 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {editingMember ? 'Edit Staff Profile' : 'Onboard New Staff / Worker'}
              </h3>
              <p className="text-xs text-indigo-200">Enter personal, job, and basic salary details in PKR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Muhammad"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Ali"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Employee ID *
              </label>
              <input
                type="text"
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. EMP-2026-001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category / Designation *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StaffCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Teacher">Teacher</option>
                <option value="Clerk">Clerk / Office Staff</option>
                <option value="Peon">Peon / Support Staff</option>
                <option value="Guard">Security Guard</option>
                <option value="Driver">Transport Driver</option>
                <option value="Admin">Administrator</option>
                <option value="Accountant">Accountant</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@apexschool.edu.pk"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                CNIC Number
              </label>
              <input
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                placeholder="35201-1234567-1"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Qualification / Degree
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="M.Sc, B.Ed, Matric"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Joining Date
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Basic Salary (PKR) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="500"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-emerald-700 bg-emerald-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Employment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StaffStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="resigned">Resigned / Terminated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Bank Account / Salary Disbursement Mode
            </label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="e.g. Meezan Bank PK36MEZN... or Cash Payment at Counter"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Residential Address
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House #, Street, City"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-md shadow-indigo-200 transition-colors"
            >
              {editingMember ? 'Save Changes' : 'Save & Onboard Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
