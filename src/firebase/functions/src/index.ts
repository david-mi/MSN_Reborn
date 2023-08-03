const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();

exports.syncPresence = functions.database.ref('/status/{uid}/displayedStatus')
  .onUpdate((change: any, context: any) => {
    const uid = context.params.uid;
    const newStatus = change.after.val();
    const isEmailVerifiedInToken = context.auth.token.email_verified;

    console.log("IS EMAIL VERIFIED IN TOKEN : " + isEmailVerifiedInToken);
    console.log("NEW STATUS " + newStatus)

    const currentUserDocumentRef = admin.firestore().doc(`/users/${uid}`);
    return currentUserDocumentRef.update({ displayedStatus: newStatus });
  });
