import { app, auth } from "../utils/firebase-admin";

export async function authenticateJWT(authorizationHeader: string | undefined) {
  const authHeader = authorizationHeader;

  if (authHeader) {
    try {
      const idToken = authHeader.split(" ")[1];

      const decodedToken = await auth.verifyIdToken(idToken);

      return decodedToken;
    } catch (error) {
      // console.log(error);
      throw new Error("unauthorized");
    }
  } else {
    throw new Error("missing token");
  }
}
