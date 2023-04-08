import * as admin from "firebase-admin";

export const app =
  admin.apps.length > 0
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert({
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        }),
      });

export const auth = admin.auth(app);
