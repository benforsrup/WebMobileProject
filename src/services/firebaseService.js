import firebase from "react-native-firebase";
import * as _ from "lodash";

export const getBadplatser = async () => {
  let badplatserRef = firebase.firestore().collection("badplatser");
  try {
    const response = await badplatserRef.get();
    // console.log(response)
  } catch (e) {
    // console.log(e)
  }
};

export const addUserToFirestore = async () => {
  return new Promise((resolve, reject) => {
    const user = firebase.auth().currentUser;
    let id = null;
    if (user) {
      id = user.toJSON().uid;
    }
    const firestoreUserRef = firebase
      .firestore()
      .collection("users")
      .doc(id);
    firestoreUserRef.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        firestoreUserRef.onSnapshot(doc => {
          resolve(true);
          // do stuff with the data
        });
      } else {
        let userObject = {
          favorites: [],
          upvoted: [],
          id: firestoreUserRef.id,
          userDetail: user.toJSON()
        };
        firestoreUserRef
          .set(userObject)
          .then(val => {
            resolve(true);
          })
          .catch(error => {
            reject(error);
          });
        // usersRef.set({...}) // create the document
      }
    });
  });
};

export const removeFromFavorites = async id => {
  try {
    const { currentUser } = firebase.auth();
    const firestoreRef = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);

    firestoreRef.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        let { favorites } = docSnapshot.data();
        if (favorites.indexOf(id) != -1) {
          _.remove(favorites, e => {
            return e == id;
          });
        }

        firestoreRef.update("favorites", favorites);
      } else {
      }
    });
  } catch (error) {
  }
};

export const addToFavoritesService = async id => {
  try {
    const { currentUser } = firebase.auth();
    const firestoreRef = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);

    firestoreRef.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        let { favorites } = docSnapshot.data();
        if (favorites.indexOf(id) == -1) {
          favorites.push(id);
        }

        firestoreRef.update("favorites", favorites);
      } else {
      }
    });
  } catch (error) {
  }
};

export const addToUpvotesService = async id => {
  try {
    const { currentUser } = firebase.auth();
    const firestoreRef = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);
    const firestoreLocationsRef = firebase
      .firestore()
      .collection("badlocations")
      .where("feature.id", "==", id);

    firestoreRef.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        let { upvoted } = docSnapshot.data();
        if (upvoted.indexOf(id) == -1) {
          upvoted.push(id);
        }
        firestoreRef.update("upvoted", upvoted);
      } else {
      }
    });
  } catch (error) {
  }
};

export const removeFromUpvoted = async id => {
  try {
    const { currentUser } = firebase.auth();
    const firestoreRef = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);

    firestoreRef.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        let { upvoted } = docSnapshot.data();
        if (upvoted.indexOf(id) != -1) {
          _.remove(upvoted, e => {
            return e == id;
          });
        }

        firestoreRef.update("upvoted", upvoted);
      } else {
      }
    });
  } catch (error) {
  }
};

export const addToLocationsUpvote = async data => {
  const id = data.payload;
  const add = data.upvote;
  const firestoreLocationsRef = firebase
    .firestore()
    .collection("upvotes")
    .doc(id);
  try {
    firestoreLocationsRef
      .get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          let { upvotes } = docSnapshot.data();
          upvotes = add ? upvotes + 1 : upvotes - 1;
          docSnapshot.ref.update("upvotes", upvotes);
        }
      })
      .catch(error => console.log(error));
  } catch (error) {
  }
};
