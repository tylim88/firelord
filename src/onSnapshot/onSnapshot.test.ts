import { onSnapshot } from './onSnapshot'
import {
	generateRandomData,
	compareWriteDataWithDocSnapData,
	initializeApp,
	userRefCreator,
	User,
} from '../utilForTests'
import { setDoc, deleteDoc } from '../operations'
import {
	IsSame,
	IsTrue,
	DocumentSnapshot,
	QuerySnapshot,
	QueryDocumentSnapshot,
} from '../types'
import { query } from '../refs'
import { where } from '../queryClauses'

initializeApp()
const userRef = userRefCreator()
const docId1 = 'onSnapshotOneDocTest'
const docId2 = 'onSnapshotWithOptionsOneDocTest'
const docId3 = 'onSnapshotNakedQueryTest'
const docId4 = 'onSnapshotWithOptionQueryTest'
describe('test onSnapshot', () => {
	afterAll(async () => {
		await Promise.all([
			deleteDoc(userRef.doc(docId1)),
			deleteDoc(userRef.doc(docId2)),
			deleteDoc(userRef.doc(docId3)),
			deleteDoc(userRef.doc(docId4)),
		])
	})
	it('test one doc functionality and type', done => {
		const docRef = userRef.doc(docId1)
		const data = generateRandomData()
		expect.hasAssertions()
		setDoc(docRef, data).then(() => {
			const unsub = onSnapshot(docRef, async documentSnapshot => {
				type A = typeof documentSnapshot
				type B = DocumentSnapshot<User>
				IsTrue<IsSame<B, A>>()
				compareWriteDataWithDocSnapData(data, documentSnapshot)
				unsub()
				done()
			})
		})
	})
	it('test one doc functionality and type', done => {
		const docRef = userRef.doc(docId2)
		const data = generateRandomData()
		expect.hasAssertions()
		setDoc(docRef, data).then(() => {
			const unsub = onSnapshot(
				docRef,
				async documentSnapshot => {
					type A = typeof documentSnapshot
					type B = DocumentSnapshot<User>
					IsTrue<IsSame<B, A>>()
					compareWriteDataWithDocSnapData(data, documentSnapshot)
					unsub()
					done()
				},
				() => {
					//
				}
			)
		})
	})
	it('test naked query functionality and type', done => {
		const docRef = userRef.doc(docId3)
		const data = generateRandomData()
		expect.hasAssertions()
		setDoc(docRef, data).then(() => {
			const unsub = onSnapshot(
				query(userRef.collection()),
				async querySnapshot => {
					type A = typeof querySnapshot
					type B = QuerySnapshot<User>
					IsTrue<IsSame<B, A>>()
					const queryDocumentSnapshot = querySnapshot.docs.filter(
						doc => doc.id === docId3
					)[0]
					if (queryDocumentSnapshot) {
						type C = typeof queryDocumentSnapshot
						type D = QueryDocumentSnapshot<User>
						IsTrue<IsSame<C, D>>()
						compareWriteDataWithDocSnapData(data, queryDocumentSnapshot)
					}
					expect(queryDocumentSnapshot).not.toBe(undefined) // ! sometime this will fail, only in admin, never in web, why?
					unsub()
					done()
				},
				() => {
					//
				}
			)
		})
	})
	it('test query functionality and type', done => {
		const docRef = userRef.doc(docId4)
		const data = generateRandomData()
		expect.hasAssertions()
		setDoc(docRef, data).then(() => {
			const unsub = onSnapshot(
				query(userRef.collection(), where('a.b.c', '==', data.a.b.c as number)),
				async querySnapshot => {
					type A = typeof querySnapshot
					type B = QuerySnapshot<User>
					IsTrue<IsSame<B, A>>()
					const queryDocumentSnapshot = querySnapshot.docs.filter(
						doc => doc.id === docId4
					)[0]
					expect(querySnapshot.docs.length).toBe(1)
					expect(queryDocumentSnapshot).not.toBe(undefined)
					if (queryDocumentSnapshot) {
						type C = typeof queryDocumentSnapshot
						type D = QueryDocumentSnapshot<User>
						IsTrue<IsSame<C, D>>()
						compareWriteDataWithDocSnapData(data, queryDocumentSnapshot)
					}
					unsub()
					done()
				}
			)
		})
	})
})
