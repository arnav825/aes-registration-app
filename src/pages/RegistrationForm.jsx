import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRANCHES } from '../data/competitions';
import { useRegistration } from '../context/RegistrationContext';
import Header from '../components/Header';
import {
  generateRegistrationId,
  checkDuplicate,
  submitRegistration,
} from '../firebase';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const { selectedCategory, selectedLevel, setCompletedReg } = useRegistration();

  const [form, setForm] = useState({
    studentName: '',
    class: '',
    branch: '',
    teacherName: '',
    language: '',
  });
  const [errors, setErrors]     = useState({});
  const [submitErr, setSubmitErr] = useState('');
  const [loading, setLoading]   = useState(false);

  if (!selectedCategory || !selectedLevel) {
    navigate('/category');
    return null;
  }

  const validate = () => {
    const e = {};
    if (!form.studentName.trim()) e.studentName = 'Student name is required';
    if (!form.class.trim())       e.class        = 'Class is required';
    if (!form.branch)             e.branch       = 'Please select a school branch';
    if (!form.teacherName.trim()) e.teacherName  = 'Teacher name is required';
    if (selectedLevel?.showLanguage && !form.language) e.language = 'Please select a language';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setSubmitErr('');

    try {
      // Duplicate check
      const isDuplicate = await checkDuplicate(
        form.studentName,
        selectedCategory.id,
        form.branch
      );
      if (isDuplicate) {
        setSubmitErr(
          `${form.studentName} is already registered for ${selectedCategory.name} from ${form.branch}.`
        );
        setLoading(false);
        return;
      }

      // Generate ID
      const regId = await generateRegistrationId(selectedCategory.code);

      // Save to Firestore
      const data = {
        studentName:  form.studentName.trim(),
        class:        form.class.trim(),
        branch:       form.branch,
        teacherName:  form.teacherName.trim(),
        language:     form.language || '',
        categoryId:   selectedCategory.id,
        categoryName: selectedCategory.name,
        categoryCode: selectedCategory.code,
        levelId:      selectedLevel.id,
        levelName:    selectedLevel.name,
        levelClasses: selectedLevel.classes,
        registrationId: regId,
      };

      await submitRegistration(data);
      setCompletedReg(data);
      navigate('/success');
    } catch (err) {
      console.error(err);
      setSubmitErr('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (id, label, placeholder, type = 'text') => (
    <div className={`animate-fade-in-up stagger-${['studentName','class','branch','teacherName'].indexOf(id) + 1}`}>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[id]}
        onChange={e => {
          setForm(p => ({ ...p, [id]: e.target.value }));
          if (errors[id]) setErrors(p => ({ ...p, [id]: '' }));
        }}
        className={`input-field ${errors[id] ? 'input-error' : ''}`}
      />
      {errors[id] && (
        <p className="text-red-500 text-xs mt-1 font-medium">{errors[id]}</p>
      )}
    </div>
  );

  return (
    <div className="screen-container">
      <Header title="Student Details" showBack step={3} totalSteps={3} />

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* Summary chip */}
        <div className="card mb-5 animate-fade-in flex items-center gap-3">
          <span className="text-2xl">{selectedCategory.icon}</span>
          <div>
            <p className="font-bold text-sm text-gray-800">{selectedCategory.name}</p>
            <p className="text-xs text-gray-400 font-medium">
              {selectedLevel.name} · {selectedLevel.classes}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {field('studentName', 'Student Name', 'e.g. Rahul Sharma')}
          {field('class', 'Class', 'e.g. 8B or Class IX')}

          {/* Branch dropdown */}
          <div className="animate-fade-in-up stagger-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              School Branch <span className="text-red-400">*</span>
            </label>
            <select
              value={form.branch}
              onChange={e => {
                setForm(p => ({ ...p, branch: e.target.value }));
                if (errors.branch) setErrors(p => ({ ...p, branch: '' }));
              }}
              className={`input-field ${errors.branch ? 'input-error' : ''}`}
            >
              <option value="">-- Select Branch --</option>
              {BRANCHES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {errors.branch && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.branch}</p>
            )}
          </div>

          {field('teacherName', 'Teacher Incharge', 'e.g. Mrs. Priya Verma')}

        {selectedLevel?.showLanguage && (
          <div className="animate-fade-in-up stagger-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Language <span className="text-red-400">*</span>
            </label>
            <select
              value={form.language}
              onChange={e => {
                setForm(p => ({ ...p, language: e.target.value }));
                if (errors.language) setErrors(p => ({ ...p, language: '' }));
              }}
              className={`input-field ${errors.language ? 'input-error' : ''}`}
            >
              <option value="">-- Select Language --</option>
              <option>English</option>
              <option>Hindi</option>
              <option>Telugu</option>
            </select>
            {errors.language && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.language}</p>
            )}
          </div>
        )}
        </div>

        {/* Submit error */}
        {submitErr && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200">
            <p className="text-red-600 text-sm font-medium">⚠️ {submitErr}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Submitting…
            </>
          ) : '✅  Submit Registration'}
        </button>

        <div className="h-6" />
      </div>
    </div>
  );
}
