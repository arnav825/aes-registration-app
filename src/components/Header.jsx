import { useNavigate } from 'react-router-dom';

export default function Header({ title, showBack = true, step, totalSteps }) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3 px-4 py-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <div className="flex-1">
          <h1 className="font-bold text-base text-primary-500 leading-tight">{title}</h1>
          {step && totalSteps && (
            <p className="text-xs text-gray-400 font-medium">Step {step} of {totalSteps}</p>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
          <span className="text-gold-400 font-black text-xs">AES</span>
        </div>
      </div>
      {step && totalSteps && (
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-primary-500 transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
