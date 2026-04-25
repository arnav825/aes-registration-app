import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';

export default function Welcome() {
  const navigate = useNavigate();
  const { reset } = useRegistration();

  const handleStart = () => {
    reset();
    navigate('/category');
  };

  return (
    <div className="screen-container bg-primary-500 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-400 opacity-40 -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-20 left-0 w-48 h-48 rounded-full bg-primary-600 opacity-30 -translate-x-1/4" />
      <div className="absolute top-1/3 left-6 w-20 h-20 rounded-full bg-gold-400 opacity-20" />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo */}
        <div className="animate-fade-in-up stagger-1 mb-6">
          <div className="w-28 h-28 rounded-3xl bg-white flex flex-col items-center justify-center shadow-2xl animate-pulse-ring">
            <span className="text-primary-500 font-black text-3xl leading-none">AES</span>
            <div className="w-12 h-0.5 bg-gold-500 my-1 rounded-full" />
            <span className="text-gold-500 font-bold text-xs tracking-widest">SCHOOLS</span>
          </div>
        </div>

        {/* Title */}
        <div className="animate-fade-in-up stagger-2 text-center mb-3">
          <h1 className="text-white font-black text-3xl leading-tight">
            Inter-School
          </h1>
          <h1 className="text-gold-300 font-black text-3xl leading-tight">
            Competition
          </h1>
          <p className="text-white font-bold text-xl mt-1">Registration</p>
        </div>

        <p className="animate-fade-in-up stagger-3 text-primary-200 text-center text-sm font-medium max-w-xs leading-relaxed mb-10">
          Register for Debate, Music, Dance, Quiz & more — all in one place!
        </p>

        {/* CTA */}
        <div className="animate-fade-in-up stagger-4 w-full max-w-xs space-y-3">
          <button
            onClick={handleStart}
            className="w-full bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-white font-black py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95"
          >
            🚀 Start Registration
          </button>
          <button
            onClick={() => navigate('/admin/login')}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl border border-white/20 transition-all duration-200 active:scale-95 text-sm"
          >
            🔐 Admin Panel
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="animate-fade-in stagger-5 pb-8 text-center relative z-10">
        <p className="text-primary-300 text-xs font-medium">
          Powered by AES Schools • Academic Year 2025-26
        </p>
      </div>
    </div>
  );
}
