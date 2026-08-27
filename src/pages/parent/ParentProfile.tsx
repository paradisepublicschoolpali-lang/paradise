import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, Phone, Mail, MapPin, Bus, HeartPulse } from 'lucide-react';

export const ParentProfile: React.FC = () => {
  const { students } = useSchoolData();
  const { currentUser } = useAuth();
  const student = students.find(s => s.id === currentUser.id || s.loginId === currentUser.loginId) || students[0];

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Bio Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <img
            src={student?.avatar || currentUser.avatar}
            alt={student?.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500 shadow-sm"
          />
          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold font-cinzel text-slate-900">{student?.name}</h2>
              <span className="px-3 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                {student?.house}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Admission: <strong className="font-mono text-slate-700">{student?.admissionNo}</strong> • Roll No: <strong className="font-mono text-slate-700">{student?.rollNo}</strong>
            </p>
            <p className="text-xs text-blue-600 font-semibold">
              {student?.grade} • Section {student?.section} (Academic Year 2026-27)
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Personal Info */}
          <div className="space-y-3 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 font-cinzel flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Personal Biodata</span>
            </h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between"><span>Date of Birth:</span> <strong className="text-slate-900">{student?.dob}</strong></div>
              <div className="flex justify-between"><span>Gender:</span> <strong className="text-slate-900">{student?.gender}</strong></div>
              <div className="flex justify-between"><span>Blood Group:</span> <strong className="text-slate-900 font-mono">{student?.bloodGroup}</strong></div>
              <div className="flex justify-between"><span>House Affiliation:</span> <strong className="text-blue-600">{student?.house}</strong></div>
              <div className="flex justify-between"><span>Locker Assigned:</span> <strong className="text-slate-900 font-mono">{student?.lockerNumber}</strong></div>
            </div>
          </div>

          {/* Guardian Info */}
          <div className="space-y-3 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 font-cinzel flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Guardian & Emergency Contacts</span>
            </h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between"><span>Primary Guardian:</span> <strong className="text-slate-900">{student?.guardianName}</strong></div>
              <div className="flex justify-between"><span>Contact Phone:</span> <strong className="text-slate-900 font-mono">{student?.guardianPhone}</strong></div>
              <div className="flex justify-between"><span>Email Address:</span> <strong className="text-slate-900">{student?.guardianEmail}</strong></div>
              <div className="flex justify-between"><span>Residential Address:</span> <strong className="text-slate-900 text-right max-w-[200px] truncate">{student?.address}</strong></div>
            </div>
          </div>

          {/* Transportation */}
          <div className="space-y-3 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 font-cinzel flex items-center gap-2">
              <Bus className="w-4 h-4 text-blue-600" />
              <span>Campus Transportation</span>
            </h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between"><span>Bus Route:</span> <strong className="text-slate-900">{student?.busRoute}</strong></div>
              <div className="flex justify-between"><span>Vehicle Number:</span> <strong className="text-slate-900 font-mono">{student?.busNumber}</strong></div>
              <div className="flex justify-between"><span>Morning Pickup:</span> <strong className="text-slate-900">07:45 AM</strong></div>
              <div className="flex justify-between"><span>Afternoon Drop:</span> <strong className="text-slate-900">04:15 PM</strong></div>
            </div>
          </div>

          {/* Medical Clearance */}
          <div className="space-y-3 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 font-cinzel flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              <span>Medical Record & Fitness</span>
            </h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between"><span>Medical Clearance:</span> <strong className="text-emerald-700">Fit for All Sports</strong></div>
              <div className="flex justify-between"><span>Allergies Reported:</span> <strong className="text-slate-900">None</strong></div>
              <div className="flex justify-between"><span>Emergency Protocol:</span> <strong className="text-slate-900">Notify Guardian</strong></div>
              <div className="flex justify-between"><span>Campus Clinic Status:</span> <strong className="text-emerald-700">Annual Checkup Done</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
