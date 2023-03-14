// import * as admin from "firebase-admin";
import initializeAdmin from "../firebase_admin";

export async function authenticateJWT(authorizationHeader: string | undefined) {
  // Initialise firebase admin
  const admin = await initializeAdmin();

  const authHeader = authorizationHeader;

  if (authHeader) {
    try {
      const idToken = authHeader.split(" ")[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.log(error);
      throw new Error("unauthorized");
    }
  } else {
    throw new Error("missing token");
  }
}
