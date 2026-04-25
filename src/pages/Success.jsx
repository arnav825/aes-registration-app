import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useRegistration } from '../context/RegistrationContext';

export default function Success() {
  const navigate = useNavigate();
  const { completedReg, reset } = useRegistration();

  if (!completedReg) {
    navigate('/');
    return null;
  }

  const {
    studentName, class: cls, branch, teacherName,
    categoryName, levelName, levelClasses, registrationId,
  } = completedReg;

  const qrData = JSON.stringify({
    id:       registrationId,
    name:     studentName,
    event:    categoryName,
    level:    levelName,
    branch:   branch,
  });

  const handleNewReg = () => {
    reset();
    navigate('/category');
  };

  const rows = [
    ['Student',  studentName],
    ['Class',    cls],
    ['Branch',   branch],
    ['Teacher',  teacherName],
    ['Event',    categoryName],
    ['Level',    `${levelName} (${levelClasses})`],
  ];

  return (
    <div className="screen-container bg-gray-50">
      {/* Top banner */}
      <div className="bg-primary-500 px-4 pt-12 pb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary-400 opacity-30 -translate-y-1/2 translate-x-1/4" />
        <div className="animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-green-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-white font-black text-2xl">Registered!</h2>
          <p className="text-primary-200 text-sm font-medium mt-1">Your spot is confirmed</p>
        </div>

        {/* Registration ID badge */}
        <div className="mt-4 inline-block animate-fade-in-up stagger-1">
          <div className="bg-gold-500 text-white px-5 py-2 rounded-full">
            <span className="font-black text-xl tracking-wider">{registrationId}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {/* QR Code */}
        <div className="card animate-fade-in-up stagger-1 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
            QR Code (Show at Event)
          </p>
          <div className="inline-block p-3 bg-white rounded-xl border border-gray-200">
            <QRCodeSVG
              value={qrData}
              size={140}
              bgColor="#FFFFFF"
              fgColor="#1B3A6B"
              level="M"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 font-medium">{registrationId}</p>
        </div>

        {/* Details */}
        <div className="card animate-fade-in-up stagger-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
            Registration Details
          </p>
          <div className="space-y-2">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-3">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wide w-16 flex-shrink-0">{label}</span>
                <span className="text-sm font-semibold text-gray-700 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 animate-fade-in-up stagger-3">
          <button onClick={handleNewReg} className="w-full btn-primary">
            ➕ Register Another Student
          </button>
          <button onClick={() => navigate('/')} className="w-full btn-secondary">
            🏠 Go to Home
          </button>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
