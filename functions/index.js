/**
 * Cloud Functions for dogs-api-slideshow-auth
 *
 * Requirement 6:
 *  - logLogin: server-side function that stores user data on each login
 *  - getLogins: returns recent login records for display in the client
 */

const { setGlobalOptions } = require("firebase-functions");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Limit concurrency a bit (optional but recommended for class projects)
setGlobalOptions({ maxInstances: 10 });

// Initialize Firebase Admin SDK (server-side)
admin.initializeApp();
const db = admin.firestore();

/**
 * logLogin
 * --------
 * Callable function. The client calls this right after a successful Google sign-in.
 * It writes a document to the "logins" collection in Firestore.
 */
exports.logLogin = functions.https.onCall(async (data, context) => {
  // Make sure the request is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be signed in to log a login event."
    );
  }

  const authToken = context.auth.token;

  await db.collection("logins").add({
    uid: context.auth.uid,
    email: authToken.email || null,
    displayName: authToken.name || null,
    loginAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { status: "ok" };
});

/**
 * getLogins
 * ---------
 * Callable function. The client uses this to pull back a list of
 * recent login events from everyone who has accessed the app.
 */
exports.getLogins = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be signed in to view login history."
    );
  }

  // Get up to 50 most recent logins, newest first
  const snap = await db
    .collection("logins")
    .orderBy("loginAt", "desc")
    .limit(50)
    .get();

  const logins = snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      uid: d.uid,
      email: d.email || "",
      displayName: d.displayName || "",
      loginAt: d.loginAt ? d.loginAt.toDate().toISOString() : null,
    };
  });

  return { logins };
});
