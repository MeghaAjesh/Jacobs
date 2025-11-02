import admin from 'firebase-admin';
export const runtime = 'nodejs';

if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

    admin.initializeApp({
      credential: admin.credential.cert({
        ...serviceAccount,
        private_key: serviceAccount.private_key.replace(/\\n/g, '\n'),
      }),
    });

    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    throw new Error('Firebase Admin initialization failed. Check your FIREBASE_SERVICE_ACCOUNT env variable.');
  }
}

export const db = admin.firestore();
export const auth = admin.auth();

export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid or expired token');
  }
}

export default admin;
