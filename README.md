<!-- markdownlint-disable MD010 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->

<p align="center">
 <a href="https://github.com/tylim88/Firelord/blob/main/img/ozai.png" rel="nofollow"><img src="img/ozai.png" width="200px" align="center" /></a>
 <h1 align="center">Firelord 烈焰君(BETA, Nodejs)</h1>
</p>

<p align="center">
 <a href="https://www.npmjs.com/package/firelord" rel="nofollow"><img src="https://img.shields.io/npm/v/firelord" alt="Created by tylim88"></a>
 <a href="https://github.com/tylim88/firelord/blob/main/LICENSE" rel="nofollow"><img src="https://img.shields.io/github/license/tylim88/firelord" alt="License"></a>
 <a href="https://github.com/tylim88/firelord/pulls" rel="nofollow"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square"></a>
</p>
<h2 align="center">
I am rewriting the damn thing, this version sucks! <a href ="https://github.com/tylim88/firelordjs" rel="nofollow">Web Version</a> is completed, the typing is 10 times better! You can expect the new Nodejs version API looks like the Web version.
</h2>
🐤 Write truly type safe and scalable Firestore code with complete deep typing Firestore wrapper.

💪🏻 Type object, array, any combination of array and object, regardless of the nesting level.

🚀 The wrapper type all read and write operations, query field path, field value, collection path, document path.

🥙 All `Snapshot`(response) are recursively typed, no more type casting.

🔥 Convert all value types to corresponding `read` types, `write` types and `compare` types (good at handling timestamp and field values).

💥 Safe typing with masked Firestore Field Value(`serverTimestamp`, `arrayRemove`, `arrayUnion` and `increment`) types.

🦚 No annoying typescript decorator needed, type in plain simple typescript. Strictly one-time setup per document. Once configured, you are ready.

🍡 Prevent empty array from hitting `in`, `not-in`, `array-contains-any`, `arrayUnion` and `arrayRemove`, peace in mind.

🍧 Use `in`, `not-in` and `array-contains-any` with more than 10 elements array.

🍁 `write` operations reject unknown member; `update` enforce partial but no undefined and skips operation if data is an empty object.

🍹 Avoid `order` and `query` limitations for you, stopping potential run-time errors before they happen.

🎄 Stop your from order the same field twice.

✨ API closely resembles Firestore API, low learning curve.

🦊 Zero dependencies.

⛲️ Out of box typescript support.

Variants:

1. [React Native](https://www.npmjs.com/package/firelordrn)
2. [JS](https://www.npmjs.com/package/firelordjs)

The package is only 22 KB before zipping and uglify, it looks big due to the images in the documentation.

require typescript 4.1 and above

# Table of Contents

- [What Is Firelord](#-what-is-firelord)
- [Getting Started](#-getting-started)
  - [Collection](#-collection)
  - [Sub-Collection](#sub-collection)
- [Conversion Table](#-conversion-table)
- [Document Operations: Write, Read and Listen](#-document-operations-write-read-and-listen)
- [Document Operations: Batch](#-document-operations-batch)
- [Document Operations: Transaction](#-document-operations-transaction)
- [Collection Operations: Query](#-collection-operations-query)
- [Collection Operations: Order And Limit](#-collection-operations-order-and-limit)
- [Collection Operations: Paginate And Cursor](#-collection-operations-paginate-and-cursor)
- [Collection Group](#-collection-group)
- [Complex Data Typing](#-complex-data-typing)
- [Set, Create and Add](#-set-create-and-add)
  - [Update](#update)
  - [Handling Firestore Field Value: Masking](#-handling-firestore-field-value-masking)
- [Circumvented Firestore Limitations](#-circumvented-firestore-limitations-runtime-errors)
- [Troubleshooting](#-troubleshooting)
- [Advices](#-advices)
  - [You Can ≠ You Should](#you-can--you-should)
  - [Nested Object](#nested-object)
  - [One Collection One Document Type](#one-collection-one-document-type)
  - [Do Not Bother Cost Focus Data Modelling](#do-not-bother-cost-focus-data-modelling)
  - [Speed](#speed)
  - [Do Not Use Firestore Rules For Complex Authorization](#Do-Not-Use-Firestore-Rules-For-Complex-Authorization)
  - [Do Not Use Offset](#do-not-use-offset)
- [Tips](#%EF%B8%8F-tips)
  - [You May Need To Keep Document ID In Document Field](#you-may-need-to-keep-document-id-in-document-field)
  - [Top Collection VS Sub Collection](#Top-Collection-VS-Sub-Collection)
- [Caveats](#-caveats)
  - [Error Hint](#error-hint)
  - [not-in](#not-in)
- [Opinionated Elements](#-opinionated-elements)
- [Limitation](#-limitation)
- [Utilities](#-utilities)
- [Road Map](#-road-map)
- [Change Log](https://github.com/tylim88/Firelord/blob/main/CHANGELOG.md) (any version that is not mentioned in the changelog is document update)

## 🐉 What Is Firelord

We need to prepare 3 sets of data types to use Firestore properly, best example is sever timestamp, when read, it is `Firestore.Timestamp`; when write, it is `Firestore.FieldValue`; and finally when compare, it is `Date|Firestore.Timestamp`.

Unfortunately `withConverter` is not enough to solve the type problems, there is still no feasible solutions to deal with type like date, Firestore.Timestamp, number and array where different types are needed in read, write and compare(query).

Firelord introduces deep typing solutions to handle every case, other than that it also provides type safety for collection path, document path, Firestore limitations(whenever is possible).

The typing solution is powerful enough for any combination of array and object regardless of nesting level.

Other than type issues, Firestore also suffers from runtime errors:

- when you hit `in`, `not-in`, `array-contains-any`, `arrayUnion` and `arrayRemove` with empty array.
- when you hit `in`, `not-in` and `array-contains-any` with 10+ elements array.
- In a compound query, range (`<`, `<=`, `>`, `>=`) and not equals (`!=`, `not-in`) comparisons do not filter on the same field.
- Use over one `array-contains` clause per query.
- If you include a filter with a range comparison (`<`, `<=`, `>`, `>=`), your first ordering is not on the same field.
- Order your query by a field included in an equality `==` or `in` clause.
- Order the same field twice.

Firelord aims to eradicate preventable errors when developing with Firestore by implementing strategies that make the most senses.

It is designed to be as friendly as possible while offering a complete Firestore typing solution.

Long thing short, Firelord make sure that:  
-It is **virtually impossible** to make any typing mistake.  
-It is **virtually impossible** to run into any runtime errors as stated in Firestore query and order limitations.

Overview:

- generate read(get operation), write type(set/update operation) and compare type(for query) for field value, example:

  - server timestamp: `{write: Firestore.FieldValue, read: Firestore.Timestamp, compare: Date | Firestore.Timestamp}`
  - number: `{write: FieldValue | number, read: number, compare:number}`
  - xArray: `{write: x[] | FieldValue, read: x[], compare: x[]}`
  - see [conversion table](#-conversion-table) for more.

- One time setting per document type: define a data type, a collection path and a document path, and you are ready to go.

  - type collection path, collection group path and document path.
  - auto generate sub collection path type.

- auto generate `updatedAt` and`createdAt` timestamp.

  - auto update `updatedAt` server timestamp to **update** operation.
  - auto add `createdAt` and `updatedAt` server timestamp to **create** and **add** operation.
  - `set` operation does not auto-add or auto-update `createdAt` and `updatedAt` because it is impossible to know whether you are using this to create or to update. However `set` accepts `createdAt`(Firelord.ServerTimestamp) and `updatedAt`(Firelord.ServerTimestamp | null) as data optionally, so you can decide on yourself how to use it.

- type complex data type like nested object, nested array, object array, array object and all their operations regardless of their nesting level. Read [Complex Data Typing](#-complex-data-typing) for more info. NOTE: There is no path for `d.e.g.h.a` because it is inside an array, read [Complex Data Typing](#-complex-data-typing) for more info.

  ![flatten object](img/flattenObject.png)

- Check your type regardless of how deep it is.

  ![type check](img/checkType.png)

- Smarter `update`:

  - skips operation if data is an empty object
  - Partial but no undefined: Prevent you from explicitly assigning `undefined` to a partial member in operation like `set`(with merge options) or `update` while still allowing you to skip that member regardless of how deep it is(You can override this behaviour by explicitly union `undefined` in the `base type`). Do note that you cannot skip any member of an object in an array due to how Firestore array works, read [Complex Data Typing](#-complex-data-typing) for more info.

  ![partial but no undefined](img/updateAndUndefined.png)

- Reject unknown member: prevent you from writing unknown member (not exist in type) into `set`,`create` and `update` operations, stop unnecessary data from entering firestore, regardless of how deep the strange member is located.

  ![reject unknown member](img/unknownMember.png)

- Prevent you from chaining <`offset`> or <`limit` and `limit to last`> for the 2nd time no matter how you chain them.

  ![limit offset](img/limitOffset.png)

- much safer `where` and `orderBy` clause

  - field values are typed accordingly to field path.
  - comparators depend on field value type, eg you cannot apply `array-contains` operator onto non-array field value.
  - stop you from order the same field twice.

  ![order twice](img/orderTwice.png)

  - whether you can chain orderBy clause or not is depends on the comparator's value, this is according to [Order Limitation](https://firebase.google.com/docs/firestore/query-data/order-limit-data#limitations), see image below. Go to [Order And Limit](#-collection-operations-order-and-limit) for documentation.

  ![orderBy limitation](img/orderBy.png)

- avoid [Query Limitation](https://firebase.google.com/docs/firestore/query-data/queries#query_limitations) for you, no more runtime surprises, prevention >>> cures.

  ![Query limitation](img/where.png)

- The 4 musketeers: serverTimestamp(FieldValue), arrayRemove(FieldValue), arrayUnion(FieldValue) and increment(FieldValue) are now typed, see [Handling Firestore Field Value: Masking](#-handling-firestore-field-value-masking) for more info.

  ![field value](img/fieldValue.png)

- Any document reference or query document reference that read or query operation returns are recursively typed, which means it has exactly the same `read`, `write` and `compare` data type for all read and write operations.

  - document reference return by `get` and `onSnapshot` are typed.
  - document reference return by `querySnapshot`'s `forEach`, `docChanges`, and `doc` are typed.

- Firestore trigger runtime error if your array is empty when dealing with `in`, `not-in`, `array-contains-any`, `arrayUnion` and `arrayRemove`. The wrapper automatic handle this problem for you, you are free to use an empty array.

- Use `in`, `not-in` and `array-contains-any` with over 10 elements array, the wrapper chunk the array and create extra queries. `not-in` is not without a caveat, read [`not-in` caveat](#not-in).

## 🦜 Getting Started

```bash
npm i firelord regenerator-runtime
npm i -D ts-essentials
```

The wrapper requires `ts-essentials` to work, install it as dev-dependency.

Add this to your very first line of code

```ts
import 'regenerator-runtime/runtime'
```

You only need to add this line once

### Collection

```ts
import { firelord, Firelord } from 'firelord'
import { firestore } from 'firebase-admin' // or import { getFirestore } from 'firebase-admin/firestore'

// create wrapper
const {
	fieldValue: { increment, arrayUnion, serverTimestamp, arrayRemove },
	wrapper,
} = firelord(firestore) // firelord(getFirestore())

// use base type to generate read and write type
type User = FirelordUtils.ReadWriteCreator<
	{
		name: string
		age: number
		birthday: Date
		joinDate: Firelord.ServerTimestamp
		beenTo: ('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[]
	}, // base type
	'Users', // collection name
	string // document name (tips: if you need specific document name, you can do something like union string literal "abc" | "efg" and template string literal `DX-${number}`)
>

// implement wrapper
const userCreator = wrapper<User>()
// collection reference
const users = userCreator.col('Users') // collection path type is "Users"
// collection group reference
const userGroup = userCreator.colGroup('Users') // collection group path type is "Users"
// document reference
const user = users.doc('1234567890') // document ID is string
```

if you need the types, here is how you get it.

```ts
// import User

// read type
type UserRead = User['read'] // {name: string, age:number, birthday: Firestore.Timestamp, joinDate: Firestore.Timestamp, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[], createdAt: Firestore.Timestamp, updatedAt: Firestore.Timestamp}

// write type
type UserWrite = User['write'] // {name: string, age:number|FirebaseFirestore.FieldValue, birthday:Firestore.Timestamp | Date, joinDate:FirebaseFirestore.FieldValue, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[] | FirebaseFirestore.FieldValue, createdAt: FirebaseFirestore.FieldValue, updatedAt: FirebaseFirestore.FieldValue}

// compare type
type UserCompare = User['compare'] // {name: string, age:number, birthday:Date | Firestore.Timestamp, joinDate: Date | Firestore.Timestamp, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[], createdAt: Date | Firestore.Timestamp, updatedAt: Date | Firestore.Timestamp}

// collection name
type UserColName = User['colName'] //"Users"

// collection path
type UserColPath = User['colPath'] // "Users"

// document ID
type UserDocId = User['docID'] // string

// document Path
type UserDocPath = User['docPath'] // `Users/${string}`
```

### Sub-Collection

This is how you define a sub-collection, just plug in parent type into the type generator's 4th parameter and the wrapper know this is a sub-collection.

The wrapper will constructs all the collection, document and collection group path types for you, easy-peasy.

```ts
// import User
// import FirelordUtils
// import wrapper

// subCollection of User
type Transaction = FirelordUtils.ReadWriteCreator<
	{
		amount: number
		date: Firelord.ServerTimestamp
		status: 'Fail' | 'Success'
	}, // base type
	'Transactions', // collection name
	string, // document name
	User // insert parent type here, it will auto construct the full path type for you
>

// implement the wrapper
const transactionCreator = wrapper<Transaction>()
const transactionsCol = transactionCreator.col('Users/283277782/Transactions') // the type for col is `User/${string}/Transactions`
const transactionGroup = transactionCreator.colGroup('Transactions') // the type for collection group is `Transactions`
const transaction = transactionsCol.doc('1234567890') // document path is string
```

I strongly against defining over one document type per collection, read [one collection one document type](#one-collection-one-document-type).

## 🦔 Conversion Table

The wrapper generate 3 types based on base type:

1. read type: the type you get when you call `get` or `onSnapshot`.
2. write type: the type for `add`, `set`, `create` and `update` operations, the type is further split into:

   -`write` type: flattened type for update operation.

   -`writeNested` type: normal object type for `add`, `set` and `create` operations.

3. compare type: the type you use in `where` clause.

All read operations return `read type` data, all write operations require `write type` data and all queries require `compare type` data, you only need to define `base type` and the wrapper will generate the other 3 types for you.

You don't need to do any kind of manipulation onto `read`, `write` and `compare` types, nor do you need to use them.

The documentation explains how the types work, the wrapper itself is intuitive in practice. thoroughly refer to the documentation only if you hit the dead end.

You SHOULD NOT try to memorize how the typing work, keep in mind the purpose is not for you to fit into the type, but is to let the type GUIDE you.

| Base                             | Read                  | Write                                                                                                              | Compare                                      |
| -------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| number                           | number                | number \| FirebaseFirestore.FieldValue(increment\*)                                                                | number                                       |
| string                           | string                | string                                                                                                             | string                                       |
| null                             | null                  | null                                                                                                               | null                                         |
| undefined                        | undefined             | undefined                                                                                                          | undefined                                    |
| Date                             | Firestore.Timestamp   | Firestore.Timestamp \|Date                                                                                         | Firestore.Timestamp \|Date                   |
| Firestore.Timestamp              | Firestore.Timestamp   | Firestore.Timestamp \|Date                                                                                         | Firestore.Timestamp \|Date                   |
| Firelord.ServerTimestamp\*\*\*   | Firestore.Timestamp   | FirebaseFirestore.FieldValue(ServerTimestamp\*)                                                                    | Firestore.Timestamp \|Date                   |
| Firestore.GeoPoint               | Firestore.GeoPoint    | Firestore.GeoPoint                                                                                                 | Firestore.GeoPoint                           |
| object\*\*                       | object                | object                                                                                                             | object                                       |
| number[]                         | number[]              | number[] \|FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*)                                                  | number[]                                     |
| string[]                         | string[]              | string[] \|FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*)                                                  | string[]                                     |
| null[]                           | null[]                | null[] \|FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*)                                                    | null[]                                       |
| undefined[]                      | undefined[]           | undefined[] \|FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*)                                               | undefined[]                                  |
| Date[]                           | Firestore.Timestamp[] | (Firestore.Timestamp \|Date )[] \|FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*)                           | (Date \| Firestore.Timestamp)[]              |
| Firestore.Timestamp[]            | Firestore.Timestamp[] | (Firestore.Timestamp \|Date )[] \|FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*)                           | (Date \| Firestore.Timestamp)[]              |
| Firelord.ServerTimestamp[]\*\*\* | never[]               | never[]                                                                                                            | never[]                                      |
| Firestore.GeoPoint[]             | Firestore.GeoPoint[]  | Firestore.GeoPoint[]                                                                                               | Firestore.GeoPoint[]                         |
| object[]\*\*                     | object[]              | object[]                                                                                                           | object[]                                     |
| n-dimension array                | n-dimension array     | n-dimension array \| FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*) only supported for 1st dimension array | compare only elements in 1st dimension array |

you can union any types, it will generate the types distributively, for example type `string | number | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][]` generates:

read type: `string | number | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][]`

write type: `string | number | FirebaseFirestore.FieldValue | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][]`

compare type: `string | number | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][]`

In practice, any union is not recommended, data should has only one type, except `undefined` or `null` union that bear certain meaning(value missing or never initialized).

NOTE: `Date | Firestore.Timestamp`, `(Date | Firestore.Timestamp)[]`, and `Date[] | Firestore.Timestamp[]` unions are redundant, because `Date` and `Firestore.Timestamp` generate same `read`, `write` and `compare` types.

\* Any FirebaseFirestore.FieldValue type will be replaced by masked type, see [Handling Firestore Field Value: Masking](#-handling-firestore-field-value-masking) for more info.

\*\* object type refer to object literal type(typescript) or map type(firestore). The wrapper flatten nested object literal, however, there are not many things to do with object[] type due to how Firestore work, read [Complex Data Typing](#-complex-data-typing) for more info.

\*\*\* `Firelord.ServerTimestamp` is a reserved type. You cannot use it as a string literal type, use this type if you want your type to be `Firestore.ServerTimestamp`. Also do note that you cannot use serverTimestamp or any Firestore field value in an array, see [Complex Data Typing](#-complex-data-typing) for more info.

## 🐘 Document Operations: Write, Read and Listen

All the document operations API is like Firestore [write](https://firebase.google.com/docs/firestore/manage-data/add-data), [read](https://firebase.google.com/docs/firestore/query-data/get-data) and [listen](https://firebase.google.com/docs/firestore/query-data/listen).

```ts
// import user

import { Firestore } from 'firebase-admin'

// get data(type is `read type`)
user.get().then(snapshot => {
	const data = snapshot.data()
})

// listen to data(type is `read type`)
user.onSnapshot(snapshot => {
	const data = snapshot.data()
})

const ServerTimestamp = Firestore.FieldValue.ServerTimestamp()

// create if only exist, else fail
// require all `write type` members(including partial member in the `base type`) except `updatedAt` and `createdAt`
// auto add `createdAt` and `updatedAt`
user.create({
	name: 'John',
	age: 24,
	birthday: new Date(1995, 11, 17),
	joinDate: ServerTimestamp,
	beenTo: ['RUSSIA'],
})

// create if not exist, else overwrite
// require all `write type` members(including partial member in the `base type`) except `updatedAt` and `createdAt`
user.set({
	name: 'John',
	age: 24,
	birthday: new Date(1995, 11, 17),
	joinDate: ServerTimestamp,
	beenTo: ['RUSSIA'],
})

// create if not exist, else update
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union the type with `undefined` in the `base type`
// the only value for `merge` is `true`
// NOTE: there will be a missing property error from typescript if all the members are not present. To fix this, just fill in `{ merge: true }` in the option, as shown below.
user.set({ name: 'Michael', beenTo: ['RUSSIA'] }, { merge: true })

// create if not exist, else update
// all members are partial members, you can leave any of the members out, however, typescript will stop you from explicitly assigning `undefined` value to any of the members unless you union the type with `undefined` in the `base type`
// the only value for `merge` is `true`
// NOTE: there will be a missing property error from typescript if all the members are not present. To fix this, just fill in `{ mergeField: fieldPath[] }` in the option, as shown below.
user.set(
	{ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) },
	{ mergeField: ['name', 'age'] } // update only `name` and `age` fields
)

// update if exist, else fail
// all members are partial members, you can leave any of the members out, however, typescript will stop you from explicitly assigning `undefined` value to any of the members unless you union the type with `undefined` in the `base type`
// auto update `updatedAt`
user.update({ name: 'Michael' })

// delete document
user.delete()
```

## 🦩 Document Operations: Batch

all API are similar to [firestore batch](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes), the only difference is, the batch is member of doc, hence you don't need to define document reference.

```ts
// import user
import { Firestore } from 'firebase-admin'

// implement the wrapper
const user = wrapper<User>().col('Users').doc('1234567890')

// create batch
const batch = firestore().batch()
const userBatch = user.batch(batch)

// delete document
userBatch.delete()

// create if exist, else fail
// require all `write type` members(including partial member in the `base type`) except `updatedAt` and `createdAt`
// auto add `updatedAt` and `createdAt`
userBatch.create({ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) })

// create if not exist, else overwrite
// require all `write type` members(including partial member in the `base type`) except `updatedAt` and `createdAt`
userBatch.set({
	name: 'John',
	age: 24,
	birthday: new Date(1995, 11, 17),
	joinDate: ServerTimestamp,
	beenTo: ['RUSSIA'],
})

// create if not exist, else update
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union the type with `undefined` in the `base type`
// the only value for `merge` is `true`
// NOTE: there will be a missing property error from typescript if all the members are not present. To fix this, just fill in `{ merge: true }` in the option, as shown below.
userBatch.set({ name: 'Michael' }, { merge: true })

// create if not exist, else update
// all members are partial members, you can leave any of the members out, however, typescript will stop you from explicitly assigning `undefined` value to any of the members unless you union the type with `undefined` in the `base type`
// the only value for `merge` is `true`
// NOTE: there will be a missing property error from typescript if all the members are not present. To fix this, just fill in `{ mergeField: fieldPath[] }` in the option, as shown below.
userBatch.set(
	{ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) },
	{ mergeField: ['name', 'age'] } // update only `name` and `age` fields
)

// update if exist, else fail
// all members are partial members, you can leave any of the members out, however, typescript will stop you from explicitly assigning `undefined` value to any of the members unless you union the type with `undefined` in the `base type`
// auto update `updatedAt`
userBatch.update({ name: 'Ozai' })

//commit
batch.commit()
```

## 🐠 Document Operations: Transaction

all API is like [firestore transaction](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes), the only difference is, the batch is a member of doc, hence you don't need to define document reference.

```ts
// import user
// import firestore

firestore().runTransaction(async transaction => {
	// get `read type` data
	await user
		.transaction(transaction)
		.get()
		.then(snapshot => {
			const data = snapshot.data()
		})

	// create if only exist, else fail
	// require all `write type` members(including partial member in the `base type`) except `updatedAt` and `createdAt`
	// auto add `createdAt` and `updatedAt`
	user.transaction(transaction).create({
		name: 'John',
		age: 24,
		birthday: new Date(1995, 11, 17),
		joinDate: ServerTimestamp,
		beenTo: ['RUSSIA'],
	})

	// create if not exist, else overwrite
	// require all `write type` members(including partial member in the `base type`) except `updatedAt` and `createdAt`
	user.transaction(transaction).set({
		name: 'John',
		age: 24,
		birthday: new Date(1995, 11, 17),
		joinDate: ServerTimestamp,
		beenTo: ['RUSSIA'],
	})

	// create if not exist, else update
	// all members are partial members, you can leave any of the members out, however, typescript will stop you from explicitly assigning `undefined` value to any of the members unless you union the type with `undefined` in the `base type`
	// the only value for `merge` is `true`
	// NOTE: there will be a missing property error from typescript if all the members are not present. To fix this, just fill in `{ merge: true }` in the option, as shown below.
	user.transaction(transaction).set({ name: 'Michael' }, { merge: true })

	// create if not exist, else update
	// all members are partial members, you can leave any of the members out, however, typescript will stop you from explicitly assigning `undefined` value to any of the members unless you union the type with `undefined` in the `base type`
	// the only value for `merge` is `true`
	// NOTE: there will be a missing property error from typescript if all the members are not present. To fix this, just fill in `{ mergeKey: fieldPath[] }` in the option, as shown below.
	user.transaction(transaction).set(
		{ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) },
		{ mergeField: ['name', 'age'] } // update only `name` and `age` fields
	)

	// update if exist, else fail
	// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union the type with `undefined` in the `base type`
	// auto update `updatedAt`
	user.transaction(transaction).update({ name: 'Michael' })
	// delete document
	user.transaction(transaction).delete()

	return
})
```

## 🌞 Collection Operations: Query

All the API are like [firestore query](https://firebase.google.com/docs/firestore/query-data/queries), clauses are chain-able.

The types obey Firestore [Query Limitation](https://firebase.google.com/docs/firestore/query-data/queries#query_limitations).

NOTE: `in` and `array-contains-any` return array of query which in the end return array of `Promise`, please use `Promise.all` or `Promise.allSettled` to resolve the promises, this is to overcome the 10 elements limitation.

```ts
// import users

// non array data type
// the field path is the keys of the `base type`
// type of opStr is '<' | '<=' | '==' | '!=' | '>=' | '>' | 'not-in' | 'in'
// if opStr is '<' | '<=' | '==' | '!=' | '>=' | '>', the value type is same as the member's type in `compare type`
users.where('name', '==', 'John').get()
// if type of opStr is 'not-in' | 'in', the value type is ARRAY of member's type in `compare type`
Promise.all(
	users.where('name', 'in', ['John', 'Michael']).map(query => query.get())
)

// array data type
// the field path is the keys of the `base type`
// type of `opStr` is  'in' | 'array-contains-any'
// if opStr is 'array-contains', the value type is the NON_ARRAY version of member's type in `compare type`
users.where('beenTo', 'array-contains', 'USA').get()
// if opStr is 'array-contains-any', the value type is same as the member's type in `compare type`
Promise.allSettled(
	users.where('beenTo', 'array-contains-any', ['USA']).map(query => query.get())
)
Promise.allSettled(
	// if opStr is 'in', the value type is the ARRAY of member's type in `compare type`
	users.where('beenTo', 'in', [['CANADA', 'RUSSIA']]).map(query => query.get())
)

// Query Limitation: https://firebase.google.com/docs/firestore/query-data/queries#query_limitations
// ok examples
users.where('age', '==', 20).limit(2).where('name', '!=', 'Sam')
users.where('age', 'not-in', [20]).limit(2).where('name', '==', 'Taylor')
users.where('age', '>', 20).limit(2).where('name', 'in', ['Brown'])
users.where('age', '!=', 20).limit(2).where('age', 'not-in', [30])
Promise.all(
	users.where('beenTo', 'array-contains-any', ['CHINA']).map(query => {
		return query.limit(2).where('age', '>', 20)
	})
)
users
	.where('age', 'not-in', [20])
	.limit(2)
	.where('beenTo', 'array-contains', 'USA')

// In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field.
// error examples
users.where('age', '!=', 20).limit(2).where('name', 'not-in', ['John'])
users.where('age', '>', 20).limit(2).where('name', '<', 'Michael')
users.where('age', 'not-in', [20]).limit(2).where('name', '<', 'Ozai')

// You can use at most one array-contains clause per query. You can't combine array-contains with array-contains-any
// error examples
users
	.where('beenTo', 'array-contains', 'USA')
	.limit(1)
	.where('beenTo', 'array-contains', 'CHINA') // ERROR
users
	.where('beenTo', 'array-contains', 'CHINA')
	.limit(1)
	.where('beenTo', 'array-contains-any', ['USA']) // ERROR

// You can use at most one in, not-in, or array-contains-any clause per query. You can't combine in , not-in, and array-contains-any in the same query.
// error examples
Promise.all(
	users.where('beenTo', 'array-contains-any', ['USA']).map(query => {
		return query.limit(1).where('age', 'in', [20])
	})
) // ERROR
users
	.where('name', 'not-in', ['ozai'])
	.limit(1)
	.where('beenTo', 'array-contains-any', ['USA']) // ERROR
users
	.where('name', 'not-in', ['ozai'])
	.limit(1)
	.where('beenTo', 'in', [['USA']]) // ERROR
```

## 🐳 Collection Operations: Order And Limit

all the API are like [firestore order and limit](https://firebase.google.com/docs/firestore/query-data/queries) with slight differences, but work the same, clauses are chain-able.

The types obey Firestore [Order Limitation](https://firebase.google.com/docs/firestore/query-data/order-limit-data#limitations).

Read this before proceeding: [Firestore OrderBy and Where conflict](https://stackoverflow.com/a/56620325/5338829) and [firestore index](https://www.fullstackfirebase.com/cloud-firestore/indexes) on how to overcome certain order limitation, this is also considered into typing.

Any `orderBy` that does not follow `where` clause does not abide by the rule and limitation mentioned above.

Note: The wrapper will not stop you from using multiple `orderBy` clause for different field, read [Multiple orderBy in firestore](https://stackoverflow.com/a/66071503/5338829) and [Ordering a Firestore query on multiple fields](https://cloud.google.com/firestore/docs/samples/firestore-query-order-multi).

NOTE: `in` and `array-contains-any` return array of query which in the end return array of `Promise`, please use `Promise.all` or `Promise.allSettled` to resolve the promises, this is to overcome the 10 elements limitation.

NOTE: for `<`, `<=`, `>`, `>=` comparators, use the shorthand form to order (see example code below).

```ts
// import users

// the field path is the keys of the `compare type`(basically keyof `base type` plus `createdAt` and `updatedAt`)

// if the member value type is array, type of `opStr` is  'in' | 'array-contains'| 'array-contains-any'
// if type of opStr is 'array-contains', the value type is the non-array version of member's type in `compare type`
users.where('beenTo', 'array-contains', 'USA').get()
// if type of opStr is 'array-contains-any', the value type is same as the member's type in `compare type`
users.where('beenTo', 'array-contains-any', ['USA']).map(query => {
	return query.get()
})
// if type of opStr is 'in', the value type is the array of member's type in `compare type`
users.where('beenTo', 'in', [['CANADA', 'RUSSIA']]).map(query => {
	return query.get()
})
// orderBy field path only include members that is NOT array type in `compare type`
users.orderBy('name', 'desc').limit(3).get()

// for `array-contains` and `array-contains-any` comparators, you can chain `orderBy` clause with DIFFERENT field path
users.where('beenTo', 'array-contains', 'USA').orderBy('age', 'desc').get()
users.where('beenTo', 'array-contains-any', ['USA', 'CHINA']).map(query => {
	return query.orderBy('age', 'desc').get()
})

// for '==' | 'in' comparators:
// no order for '==' | 'in' comparator for SAME field name, read https://stackoverflow.com/a/56620325/5338829 before proceed
users.where('age', '==', 20).orderBy('age', 'desc').get() // ERROR
// '==' | 'in' is order-able with DIFFERENT field name
users.where('age', '==', 20).orderBy('name', 'desc').get() // OK

// for '<' | '<=' | '>'| '>=' comparator
// no order for '<' | '<=' | '>'| '>=' comparator for DIFFERENT field name
users.where('age', '>', 20).orderBy('name', 'desc').get() // ERROR
// '<' | '<=]| '>'| '>=' is oder-able with SAME field name but need to use SHORTHAND form to ensure type safety
users.where('age', '>', 20).orderBy('age', 'desc').get() // ERROR
// equivalent to where('age', '>', 20).orderBy('age','desc')
users.where('age', '>', 20, { fieldPath: 'age', directionStr: 'desc' }).get() // OK
// again, no order for '<' | '<=' | '>'| '>=' comparator for DIFFERENT field name
users.where('age', '>', 20, { fieldPath: 'name', directionStr: 'desc' }).get() // ERROR

// for `not-in` and `!=` comparator, you can use normal and  shorthand form for both same and different name path
// same field path
users.where('name', 'not-in', ['John', 'Ozai']).orderBy('name', 'desc').get()
// different field path
users.where('name', 'not-in', ['John', 'Ozai']).orderBy('age', 'desc').get()

// same field path
users.where('name', '!=', 'John').orderBy('name', 'desc').get()
// different field path
users.where('name', '!=', 'John').orderBy('age', 'desc').get()

//pagination
// field path only include members that is NOT array type in `base type`
// field value type is the corresponding field path value type in `compare type`
// value of cursor clause is 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
users.orderBy('age', 'asc', { clause: 'startAt', fieldValue: 20 }).limit(5) // equivalent to orderBy("age").startAt(20).limit(5)
// usage with where
users
	.where('name', '!=', 'John')
	.orderBy('age', 'desc', { clause: 'endAt', fieldValue: 50 })
```

## 🌺 Collection Operations: Paginate And Cursor

API differ slightly from [firestore paginate and cursor](https://firebase.google.com/docs/firestore/query-data/query-cursors), the cursors became orderBy parameter, it still works the same as Firestore original API, clauses are chain-able.

```ts
// import users

// field path only include members that is NOT array type in the `base type`
// field value type is the corresponding field path value type in `compare type`
// value of cursor clause is 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
users.orderBy('age', 'asc', { clause: 'startAt', fieldValue: 20 }).offset(5) // equivalent to orderBy("age").startAt(20).offset(5)
// usage with where
users
	.where('name', '!=', 'John')
	.orderBy('age', 'desc', { clause: 'endAt', fieldValue: 50 })
// equivalent to shorthand
users
	.where('name', '!=', 'John', {
		fieldPath:: 'age',
		directionStr: 'desc',
		cursor: { clause: 'endAt', fieldValue: 50 },
	})
	.get() // equivalent to where('name', '!=', 'John').orderBy('age','desc').endAt(50)
```

## 🌵 Collection Group

Api is exactly the same as Collection Operations: [Query](#-collection-operations-query), [Order And Limit](#-collection-operations-order-and-limit), [Paginate And Cursor](Firelord#-collection-operations-paginate-and-cursor)

simply use collection group reference instead of collection reference, refer back [Getting Started](#-getting-started) on how to create collection group reference.

## 🌻 Complex Data Typing

As for (nested or not)object[] type, its document/collection operations work the same as other arrays: it will not flatten down due to how Firestore work, read [Firestore how to query nested object in array](https://stackoverflow.com/a/52906042/5338829). You cannot query(or set, update, etc) specific object member or array member in the array, nested or not, similar rule applies to a nested array.

Long thing short, any data type that is in an array, be it another array or another object with array member:

1. will not get flattened and will not have its field path built nor you can use field value (arrayRemove, arrayUnion and increment, serverTimestamp). Read [Firestore append to array (field type) an object with server timestamp](https://stackoverflow.com/a/66353116/5338829) and [How to increment a map value in a Firestore array](https://stackoverflow.com/a/58310449/5338829), both are negative.
2. unable to skip any member, object must have exact shape. If you need undefined, assign undefined to the member in the `base type` instead.

However, it is possible to query or write a specific object member (nested or not), as long as it is not in an array, the typing logic works just like other primitive data types' document/collection operation because the wrapper will flatten all the members in object type, nested or not.

NOTE: `read` type does not flatten, because there is no need to.

Last, all the object, object[], array, array object, nested or not, no matter how deep, all the field values (not specifically referring to Firestore.FieldValue) of all data types will undergo data type conversion according to the [conversion table](#-conversion-table).

consider this example

```ts
// import FirelordUtils
// import wrapper

type Nested = FirelordUtils.ReadWriteCreator<
	{
		a: number
		b: { c: string }
		d: { e: { f: Date[]; g: { h: { i: { j: Date }[] }[] } } }
	},
	'Nested',
	string
>
const nestedCreator = wrapper<Nested>()

const nestedCol = nestedCreator.col('Nested')

// read type, does not flatten because no need to
type NestedRead = Nested['read'] // {a: number, b: { c: string }, d: { e: { f: FirebaseFirestore.Timestamp[], g: { h: { i: {j: Firestore.Timestamp}[] }[] } } }	}
// write type
type NestedWrite = Nested['write'] // {a: number | FirebaseFirestore.FieldValue, "b.c": string, "d.e.f": FirebaseFirestore.FieldValue | (FirebaseFirestore.Timestamp | Date)[], "d.e.g.h": FirebaseFirestore.FieldValue | { i: {j: Firestore.Timestamp | Date}[] }[], createdAt: FirebaseFirestore.FieldValue, updatedAt: FirebaseFirestore.FieldValue}
// compare type
type NestedCompare = Nested['compare'] // {a: number, "b.c": string, "d.e.f": (FirebaseFirestore.Timestamp | Date)[], "d.e.g.h": FirebaseFirestore.FieldValue | { i: {j: Firestore.Timestamp | Date}[] }[], createdAt: Date | Firestore.Timestamp, updatedAt: Date | Firestore.Timestamp}
```

As you can see, the object flattens down and the wrapper converted all the value types

so the next question is, how are you going to shape your object so you can use it in `set`, `create` and `update` operation?

## 🍣 Set, Create and Add

Please read [set and dot syntax](https://stackoverflow.com/a/60879213/5338829) before you proceed.

In short, you cannot use dot syntax with `set` (`create` should have the same behaviour, need more clarification).

consider this example:

```ts
// import nestedCol
const completeData = {
	a: 1,
	b: { c: 'abc' },
	d: { e: { f: [new Date(0)], g: { h: [{ i: [{ j: new Date(0) }] }] } } },
}
const data = {
	a: 1,
	d: { e: { f: [new Date(0)], g: { h: [{ i: [{ j: new Date(0) }] }] } } },
}

nestedCol.doc('123456').set(completeData) // set needs complete data if no merge option
nestedCol.doc('123456').create(completeData) // create also requires complete data
nestedCol.add(completeData) // add also requires complete data
nestedCol.doc('123456').set(data, { merge: true })
```

### Update

Please read [Cloud Firestore: Update fields in nested objects with dynamic key](https://stackoverflow.com/a/47296152/5338829) before you proceed,

Yes, `update` can use dot syntax to update specific fields.

consider this example:

```ts
// import nested

const data = {
	a: 1,
	d: { e: { f: [new Date(0)], g: { h: [{ i: [{ j: new Date(0) }] }] } } },
}

nestedCol.doc('123456').update(data) // ERROR, type mismatch, if your data is nested object, please flatten your data first
```

If you want to update fields in nested objects, there are 2 ways:

1. create the flattened object by yourself.
2. use helper function: import `flatten` from `firelord`. (recommended, because it is easier)

Reminder:

1. you don't need to flatten non-nested object, but nothing will happen if you accidentally did it.
2. `update` does not require all members to exist, it will simply update that particular field.

solution:

```ts
// import nestedCol

import { flatten } from 'firelord'

// flatten by yourself(?)
const flattenedData = {
	a: 1,
	'd.e.f': [new Date(0)],
	'd.e.g.h': [{ i: [{ j: new Date(0) }] }],
}

nestedCol.doc('123456').update(flattenedData) // ok

// use helper function
const data = {
	a: 1,
	d: { e: { f: [new Date(0)], g: { h: [{ i: [{ j: new Date(0) }] }] } } },
}
nestedCol.doc('123456').update(flatten(data)) // ok, recommended, because it is easier
```

As for query, since the type is flattened, just query like you would normally query in firelord.

That is all. Call `flatten` to flatten the complex data and the rest work just like simple data, clean and simple.

## 🍱 Handling Firestore Field Value: Masking

Firestore field value, aka serverTimestamp, arrayRemove, arrayUnion and increment, they all return `FieldValue`, this is problematic, as you may use increment on an array or serverTimeStamp on a number. Kudo to whoever design this for making our life harder.

The wrapper forbids you to use any Firestore field value(serverTimestamp, arrayRemove, arrayUnion and increment) instance. We prepare another field value generator for you with the return type masked.

It still returns the same Firestore field value but with a masked return type, conversion table below shows what mask the types.

| Field Value     | Masked Type                                                                                 | Note                              |
| --------------- | ------------------------------------------------------------------------------------------- | --------------------------------- |
| increment       | { 'please import `increment` from `firelord` and call it': number }                         |
| serverTimestamp | { 'please import `serverTimestamp` from `firelord` and call it': Firelord.ServerTimestamp } |
| arrayUnion      | { 'please import `arrayUnion` or `arrayRemove` from `firelord` and call it': T }            | where T is the type of the member |
| arrayRemove     | { 'please import `arrayUnion` or `arrayRemove` from `firelord` and call it': T }            | where T is the type of the member |

the mask types purposely looks weird, so nobody accidentally uses it for something else(as it could be dangerous, because the underneath value is Firestore field value, not what typescript really think it is).

this is how you use it

```ts
// import firestore

const {
	fieldValue: { increment, arrayUnion, serverTimestamp, arrayRemove },
	wrapper,
} = firelord(firestore)

type Example = FirelordUtils.ReadWriteCreator<
	{
		aaa: number | undefined
		bbb: Firelord.ServerTimestamp
		ddd: string[]
	},
	'Example',
	string
>

const exampleCreator = wrapper<Example>()

const exampleCol = exampleCreator.col('Example')

exampleCol.doc('1234567').set({
	aaa: arrayUnion('123', '456'), // ERROR
	bbb: increment(11), // ERROR
	ddd: arrayUnion('ddd', 123, 456), // ERROR <- at first typescript will not highlight this error unless you solve other error first, which mean in the end it still able to catch all error, so don't panic
})

exampleCol.doc('1234567').set({
	aaa: increment(1), // ok
	bbb: serverTimestamp(), // ok
	...arrayUnion('ddd', '123', '456'), // ok, you can also write this as `...arrayUnion('ddd', ...['123', '456'])`
})
```

The API is like Firestore API, except `arrayUnion` and `arrayRemove`, the API is designed in such a way to deal with empty array errors while keeping your type safe.

same working logic apply to complex data type.

if you try to use the original Firestore field value, the wrapper will stop you.

## 🍝 Circumvented Firestore Limitations (Runtime Errors)

![limitation](img/limitation.png)

Other runtime errors circumvented:

- Prevent empty array from hitting `in`, `not-in`, `array-contains-any`, `arrayUnion` and `arrayRemove`.

- prevent ordering the same field twice.

## 🌷 Troubleshooting

If you run into runtime error like `query snapshot is null`, most likely it is due to a permission issue, check your Firestore rule.

## 🐬 Advices

### You Can ≠ You Should

Although the wrapper can handle virtually any complex data type, it doesn't mean you should model the data in such a way, especially when dealing with the array.

When dealing with an array, avoid array of objects

not only these data types are hard to query and hard to massage, but they also pose great difficulty to security rule, especially if the permission is relying on the data.

Use array on primitive data types, if you really need to store object type, make sure it is not something that you need to query in future.

Theoretically speaking, it is possible to create a flat structure for all kinds of data types, but this is harder to be done in Firestore because your data model affects the pricing.

The pricing model incentives you to put more data in the same document, hence you see people doing all kind of array of objects.

Anyway, do not resort to array of objects types easily, create a new collection instead. Always keep your data type straightforward if possible.

### Nested Object

In firestore, nested object working logic is like a flat object, as long as you get the path right, you can query and write them with no issue. A nested object is fine, as long as you structure it in how a human mind can easily comprehend it, eg do not nest too deep.

### Do Not Bother Cost Focus Data Modelling

Firestore may look simple, but it is incredibly difficult to model especially if you aim to save as much as cost as possible, that is aggregating your data. My advice is, do not bother, because it increases your project complexity, and it doesn't worth the time and money to aggregate the data, unless it is a simple aggregation.

However, if aggregation can save you a significant amount of money(assuming you already model your data correctly), chances are, you are probably not using the right database, use other databases (PSQL or MongoDB), it is much better and easier in terms of cost handling.

### One Collection One Document Type

It is possible to have multiple document types under the same collection. For example, under a `User` collection, you may be tempted to create `profile` and `setting`(`User/{userId}/Account/[profile and setting]`) documents in it. Or you may create two collections under `User` that contains only a single document:`User/{userId}/Profile/profile` and `User/{userId}/Setting/setting`.

I would recommend instead of creating `profile` and `setting`, you create two top collections: `profile` and `setting` that contain all users' profiles and settings instead.

Logically, there should be one type of document in on collection(hence the name `collections`).

If this is not enough to convince you: Query.

With `Group Collection Query`, it is possible to query sub collection like how you query a top collection. I highly recommend that you enforce one collection one document type. This avoids you from accidentally querying another collection with the same name but has a different document type.

### Speed

Don't use Firestore if speed matter. The query time of Firestore is [depend on result set, not total data set](https://stackoverflow.com/a/58859764/5338829), which means the more data set you have the better Firestore performs against other database.

Though it is unsure at what point Firestore performance start to exceed other databases, my guess is most people are not likely to hit that point.

Thus don't expect much from the speed, use Firestore for task that is not time critical.

### Do Not Use Firestore Rules For Complex Authorization

Firestore rule sucks big time:

1. You need to learn a language that is somehow similar to Javascript but is useless anywhere else
2. No type safety, full YOLO mode.
3. Code is not scalable and maintainable, it is nightmare to debug.
4. No open source and tooling support like Javascript, you going to miss a lot of powerful validation libraries like `joi`, `yup` and `zod`.

Run write operations in cloud function. Yes, cloud function cost you money per invoke, but write operation is much less frequent compare to read operation, the cost is definitely lower than the cost to maintain Firestore rules.

If the cost is your concern, you can always set up a custom backend.

Read operation requires only simple authorization, but some applications may require complicated authorization, in that case, it is also better to drop all the Firestore rules and validate it via a custom backend.

One thing you will miss is the optimistic update, well until Firestore allows us to write rules in mainstream languages, we need to create our own optimistic update solutions.

Only use Firestore rule for simple authorization.

### Do Not Use `Offset`

The server library comes with `offset` cursor that is not available in the client library. However, it still charges you for all the documents that you are offsetting: [source](https://youtu.be/poqTHxtDXwU?t=552)

## ❄️ Tips

### You May Need To Keep Document ID in Document Field

It is redundant to store the document id in the document field, especially if you want to query it.

For example, in Users collection, where the document ID is the user UID, now you want to query 5 user documents and the information you have is the user UID (it is common to use user UID as some kind of foreign key).

If you store the UID in the field, you only need to make 1 request to query all the documents, else you need to make 5 requests, which is ineffective.

### Top Collection VS Sub Collection

With `Group Collection Query`, it is possible to query sub collection like how you query a top collection. So there is not much differences between what they can do and their performance(Firestore speed are based on the result set, not the data set).

Here are a few things you still need to consider:

- sub-collection path name is longer.
- top collection requires more information(the path name in sub-collection) for you to query it properly. However, as explained in [You May Need To Keep Document ID In Document Field](#you-may-need-to-keep-document-id-in-document-field), so this is not really a minus point.

if you follow [One Collection One Document Type](#one-collection-one-document-type) advice, and if you have only one document in one collection and this will not change in the future: The existence of such document is unique, for example, a user will have only one `setting` document, then it is better to turn it into a top collection.

## 🦎 Caveats

### Error Hint

Because of the heavy use of generic types and utility types, typescript hints may look chaotic. The wrapper priority is to make sure you cannot go wrong. There will be no false positive, only misplaced negative like:

1. no error shown on member that has type error if other members also having type errors
2. error shown on member that is ok instead
3. everything has type error

However, there is no need to be panic. As long as there is an error, then something must be wrong. Simply check your data type carefully.

### `not-in`

Although the wrapper can help you with `array-contains-any` and `in` comparator 10 elements limit, it is virtually impossible to overcome the similar limitation on `not-in` comparator.

Here are the solutions that will NOT work:

- _chunk the array and create multiple queries just like what we did to `array-contains-any` and `in`._

This will not work, in fact, this is a very terrible idea. Here is why:

you have array like this [1,2,3,4,5,6,7,8,9,10,11], after chunking, you have 2 arrays: [1,2,3,4,5,6,7,8,9,10] and [11] and you run 2 queries with it.

The first query will return all documents that do not contain `1,2,3,4,5,6,7,8,9 or 10`.

The 2nd query, however, will return all documents that do not contain `11`, this includes documents that were filtered by query 1.

Basically chunking makes thing worse.

- _using typescript to circumvent it._

This is impossible as array size can only be determined on runtime, so neither can typescript help you.

- _Checking the array size in runtime, if over 10, prevent the `not-in` query from running._

So you skip the query, then what? How are you going to fill the data void after that?

You need the query. It is inevitable.

- _not using `not-in` at all._

Seriously doubt this is doable, `not-in` query is like one of the most useful queries in all kinds of databases. I don't think you can survive without it.

====

There is only one solution to this problem: first, run the query with 10 elements, then filter the rest of the query result with the rest of the elements.

We implemented the solution in the wrapper; you don't need to do anything to utilize it.

The `querySnapshot`'s `forEach`, `docChanges`, `docs`, `empty` and `size` values are all recomputed base on the extra elements.

Not the ideal solution, but this is the only option we have, the wrapper simply help you filter the rest so you don't have to.

There is nothing can be done on our side. It is up to Google to improves this.

## 🐕 Opinionated Elements

Code wise, there is one opinionated element in the wrapper, that is `createdAt` and `updatedAt` timestamp that add or update automatically.

when a document is created via `add`, `create` without option, two things will happen:

1. createdAt field path is created, and the value is Firestore server timestamp(current server timestamp).
2. updatedAt field path is created, and the value is `null`.

when a document is updated via `update` with option:

1. updatedAt field path is updated and the value is Firestore server timestamp.

This behaviour may be undesirable for some people. I will improve this in future by giving the developer choice.

Finally there is no auto update/add `updatedAt` and `created` for set operation as it is not possible to tell whether you want to create or update.

However `set` now accepts `createdAt`(Firelord.ServerTimestamp) and `updatedAt`(Firelord.ServerTimestamp | null) as data optionally, so you can decide on yourself how to use it.

Typing wise, there are few opinionated elements:

1. `set`(without option) and `create` operations require all member to present.
2. all write operations reject unknown members.
3. although `updatedAt` and `createdAt` is included in type, all write operation exclude them, which mean you cant write the value of `updatedAt` and `createdAt`.

I believe this decision is practical for cases and not planning to change it in the forseeable future.

## 🐇 Limitation

While the wrapper try to safeguard as much type as possible, some problem cannot be solved due to typing difficulty, or require huge effort to implement, or straight up cannot be solved.

1. `Firelord.ServerTimestamp` is a reserved type, underneath it is a string and you cannot use it as a string literal type, the collision chance is very small so there is nothing to worry about.
2. All mask types are passive reserved types, you cannot use them as object type nor use them for any purpose(the wrapper will turn mask types into `never` if you use them).
3. Unable to works with Record<number, any> or Record<`` `${number}` ``, any>:

```ts
type P = `${number}` extends `${infer P}` ? P : never // P is still `${number}`
type P = `${1 | 2}` extends `${infer P}` ? P : never // P is still "1" | "2", expect 1 | 2
```

Long thing short, do not use numeric as index.

If you really need a numeric solution, you can use string numeric `Record<'1'|'2'|'3'|'4', any>`, not a perfect solution but will works for some cases.

## 💍 Utilities

Since write operations reject unknown members (member that are not defined in base type), you can use [object-exact](https://www.npmjs.com/package/object-exact) to remove the unknown members, the library returns the exact type, so it should work well with the wrapper.

Do not use `flatten` for other purposes. If you need it, see [object-flat](https://www.npmjs.com/package/object-flat), it is a general purpose library. Do not use `object-flat` in firelord as it is not specifically tailored for firelord, use firelord native `flatten` instead.

If you are looking to chunk an array: [array-chop](https://www.npmjs.com/package/array-chop)

Disclaimer: I am the author of all the packages.

## 🐎 Road Map

- jsDoc (important)
- tests (important)
- allow `update` to accept both flatten and nested object thus able to automate flatten internally (difficult, minor improvement)
- data validation with `zod`.(moderate improvement, possibly out of scope of this library)
- initial data type for all write operation except `update`.(minor improvement, impractical)
- support numeric index **Record<number, any>** or **Record<`` `${number}` ``, any>**(seemly impossible, typescript limitation(?), minor improvement)
