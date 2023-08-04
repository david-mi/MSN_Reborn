import * as admin from "firebase-admin";
import * as functions from "firebase-functions"
admin.initializeApp();

exports.onStatusEntriesWrite = functions.database.ref('/status/{uid}/entries')
  .onCreate(async (change, context) => {
    const uid = context.params.uid;

    const savedStatusRef = change.ref.parent!.child("saved")
    const savedStatusRefSnapshot = await savedStatusRef.get()
    const savedStatus = savedStatusRefSnapshot.val()

    const currentUserDocumentRef = admin.firestore().doc(`/users/${uid}`);
    return currentUserDocumentRef.update({ displayedStatus: savedStatus });
  })

exports.onStatusEntriesDelete = functions.database.ref('/status/{uid}/entries')
  .onDelete(async (_, context) => {
    const uid = context.params.uid;
    const currentUserDocumentRef = admin.firestore().doc(`/users/${uid}`);
    return currentUserDocumentRef.update({ displayedStatus: "offline" });
  })
