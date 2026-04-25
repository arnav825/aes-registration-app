import { useNavigate } from 'react-router-dom';
import { LEVELS } from '../data/competitions';
import { useRegistration } from '../context/RegistrationContext';
import Header from '../components/Header';

export default function LevelSelect() {
  const navigate = useNavigate();
  const { selectedCategory, setSelectedLevel } = useRegistration();

  if (!selectedCategory) {
    navigate('/category');
    return null;
  }

  const levels = LEVELS[selectedCategory.id] || [];

  const handleSelect = (level) => {
    setSelectedLevel(level);
    navigate('/register');
  };

  return (
    <div className="screen-container">
      <Header title="Select Level" showBack step={2} totalSteps={3} />

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* Category badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 border animate-fade-in"
          style={{
            background: selectedCategory.bg,
            borderColor: selectedCategory.border,
          }}
        >
          <span className="text-base leading-none">{selectedCategory.icon}</span>
          <span className="font-bold text-sm" style={{ color: selectedCategory.color }}>
            {selectedCategory.name}
          </span>
        </div>

        <p className="text-gray-500 text-sm font-medium mb-4">
          Select the appropriate level for your class:
        </p>

        <div className="space-y-3">
          {levels.map((level, i) => (
            <button
              key={level.id}
              onClick={() => handleSelect(level)}
              className={`animate-fade-in-up stagger-${i + 1} w-full text-left card flex items-center gap-4 hover:border-primary-300 hover:shadow-md active:scale-98 transition-all duration-200 active:scale-95 group`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0 group-hover:scale-105 transition-transform"
                style={{ background: selectedCategory.color }}
              >
                {level.name.startsWith('Level')
                  ? level.name.replace('Level ', 'L')
                  : level.name.slice(0, 3).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{level.name}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{level.classes}</p>
              </div>
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke={selectedCategory.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
