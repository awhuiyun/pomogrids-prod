import * as admin from "firebase-admin";

export default async function initializeAdmin() {
  try {
    if (admin.apps.length > 0) {
      return admin.app();
    }

    return admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      }),
    });
  } catch (error) {
    throw error;
  }
}
