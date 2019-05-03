import firebase from 'react-native-firebase'
import * as _ from 'lodash'
export const getBadplatser = async () => {
	let badplatserRef = firebase.firestore().collection('badplatser')
	try{
		const response = await badplatserRef.get()
		// console.log(response)
		
	} catch(e){
		// console.log(e)
	}
}

export const addUserToFirestore = async () => {
	return new Promise((resolve, reject) => {
		const user = firebase.auth().currentUser
		let id = null
		if(user){
			 id = user.toJSON().uid
		}
		const firestoreUserRef = firebase.firestore().collection('users').doc(id)
		firestoreUserRef.get()
			.then((docSnapshot) => {
				if (docSnapshot.exists) {
					console.log("it does exist")
					firestoreUserRef.onSnapshot((doc) => {
						resolve(true)
						// do stuff with the data
					});
				} else {
					console.log("create document")
					let userObject ={
						favorites:[],
						upvoted:[],
						id: firestoreUserRef.id,
						userDetail: user.toJSON()
					}
					console.log(userObject)
					firestoreUserRef.set(userObject).then((val) => {
						resolve(true)
					}).catch((error) => {
						reject(error)
					})
				// usersRef.set({...}) // create the document
				}
			});
	})
}


export const removeFromFavorites = async (id) => {
	try{

    const { currentUser } = firebase.auth() 
    const firestoreRef = firebase.firestore().collection('users').doc(currentUser.uid)
    
    firestoreRef.get()
			.then((docSnapshot) => {
				if (docSnapshot.exists) {
					
					let { favorites } = docSnapshot.data()
					console.log(favorites)
					if(favorites.indexOf(id) != -1){
						_.remove(favorites, (e) => {
							return e == id
						})
					}
					console.log(favorites)

					firestoreRef.update("favorites", favorites)
					
				} else {
                    console.log("user data does not exist")

				}
			});
	} catch (error){
		console.log(error)
	}
}

export const addToFavoritesService = async (id) => {
	try{

    const { currentUser } = firebase.auth() 
    const firestoreRef = firebase.firestore().collection('users').doc(currentUser.uid)
    
    console.log("heey", currentUser)
    firestoreRef.get()
			.then((docSnapshot) => {
				if (docSnapshot.exists) {
					console.log(id)
					let { favorites } = docSnapshot.data()
					if(favorites.indexOf(id) == -1){
						favorites.push(id);
					}
					
					firestoreRef.update("favorites", favorites)
					
				} else {
                    console.log("user data does not exist")

				}
			});
	} catch (error){
		console.log(error)
	}
}