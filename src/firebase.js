// ============================================================
//  FIREBASE CONFIGURATION
//  Replace the values below with your own Firebase project config.
//  Go to: Firebase Console → Project Settings → Your Apps → SDK setup
// ============================================================

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ─────────────────────────────────────────────────────────────
//  HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

/** Generate the next sequential registration ID for a given category code */
export async function generateRegistrationId(categoryCode) {
  const snap = await getDocs(
    query(collection(db, 'registrations'), where('categoryCode', '==', categoryCode))
  );
  const count = snap.size + 1;
  return `AES-${categoryCode}-${String(count).padStart(3, '0')}`;
}

/** Check for duplicate: same student name + same category + same branch */
export async function checkDuplicate(studentName, categoryId, branch) {
  const snap = await getDocs(
    query(
      collection(db, 'registrations'),
      where('studentName', '==', studentName.trim()),
      where('categoryId', '==', categoryId),
      where('branch', '==', branch)
    )
  );
  return !snap.empty;
}

/** Submit a new registration */
export async function submitRegistration(data) {
  const docRef = await addDoc(collection(db, 'registrations'), {
    ...data,
    timestamp: serverTimestamp(),
  });
  return docRef.id;
}

/** Fetch all registrations (admin) */
export async function fetchAllRegistrations() {
  const snap = await getDocs(
    query(collection(db, 'registrations'), orderBy('timestamp', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Delete a registration */
export async function deleteRegistration(docId) {
  await deleteDoc(doc(db, 'registrations', docId));
}

/** Update a registration */
export async function updateRegistration(docId, data) {
  await updateDoc(doc(db, 'registrations', docId), data);
}
