import firebase from 'react-native-firebase'

export const getBadplatser = async () => {
	let badplatserRef = firebase.firestore().collection('badplatser')
	try{
		const response = await badplatserRef.get()
		// console.log(response)
		
	} catch(e){
		// console.log(e)
	}
}