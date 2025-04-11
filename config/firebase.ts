import {
    getFirestore,
    initializeFirestore,
    disableNetwork,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    enableNetwork,
} from '@react-native-firebase/firestore'
import { getApp } from '@react-native-firebase/app'

function Firebase() {
    const init = async () => {
        try {
            const app = getApp()
            initializeFirestore(app, {
                persistence: true,
            })
        } catch (error) {
            console.error('Firebase initialization error', error)
        }
    }

    const search = async () => {
        const firestore = getFirestore()

        const usersRef = collection(firestore, 'users')
        const q = query(usersRef, where('age', '>', 18))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            console.log('User data:', doc.data())
        })
    }

    init()
}

async function addUser() {
    try {
        const firestore = getFirestore()
        const usersRef = collection(firestore, 'users')
        const userRef = doc(usersRef, 'user2')
        const userData = {
            name: 'Renan Kaic',
            age: 35,
        }

        await setDoc(userRef, userData)
            .then(() => {
                console.log('User added')
            })
            .catch((error) => {
                console.error('Error adding user:', error)
            })
    } catch (error) {
        console.error('Error in addUser:', error)
    }
}

export async function DisableNetwork(disable: boolean) {
    const firestore = getFirestore()
    console.log('Status of network:', disable)
    if (disable) {
        await disableNetwork(firestore)
        console.log('Network disabled')
        await addUser()
        return
    }
    console.log('Network enabled')
    await enableNetwork(firestore)
}

Firebase()

export default Firebase
