import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/competitions';
import { useRegistration } from '../context/RegistrationContext';
import Header from '../components/Header';

export default function CategorySelect() {
  const navigate = useNavigate();
  const { setSelectedCategory } = useRegistration();

  const handleSelect = (cat) => {
    setSelectedCategory(cat);
    navigate('/level');
  };

  return (
    <div className="screen-container">
      <Header title="Select Competition" showBack step={1} totalSteps={3} />

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <p className="text-gray-500 text-sm font-medium mb-4 animate-fade-in">
          Which event are you registering for?
        </p>

        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat)}
              className={`animate-fade-in-up stagger-${i + 1} text-left rounded-2xl p-4 border-2 transition-all duration-200 active:scale-95 hover:shadow-md`}
              style={{
                background: cat.bg,
                borderColor: cat.border,
              }}
            >
              <div className="text-3xl mb-2 leading-none">{cat.icon}</div>
              <p className="font-bold text-sm leading-tight" style={{ color: cat.color }}>
                {cat.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 font-medium leading-tight">
                {cat.description}
              </p>
            </button>
          ))}
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
