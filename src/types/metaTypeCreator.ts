import { Timestamp, Bytes, GeoPoint } from './alias'
import {
	ErrorFieldValueInArray,
	ErrorUnassignedAbleFieldValue,
	NoUndefinedAndBannedTypes,
	NoDirectNestedArray,
	ErrorPossiblyUndefinedAsArrayElement,
	ErrorCollectionIDString,
} from './error'
import { IsValidID } from './validID'
import {
	FieldValues,
	UnassignedAbleFieldValue,
	ArrayUnionOrRemove,
	Increment,
	DeleteField,
	ServerTimestamp,
	PossiblyReadAsUndefined,
} from './fieldValue'
import { ObjectFlatten, DeepValue } from './objectFlatten'
import { RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg } from './markUnionObjectAsError'
import { StrictOmit, IsSame } from './utils'
import { DocumentReference } from './refs'

export type MetaType = {
	collectionPath: string
	collectionID: string
	docID: string
	docPath: string
	read: Record<string, unknown>
	write: Record<string, unknown>
	writeMerge: Record<string, unknown>
	writeFlatten: Record<string, unknown>
	compare: Record<string, unknown>
	base: Record<string, unknown>
	parent: MetaType | null
	ancestors: MetaType[]
}

type CommonAbstractProps =
	| 'base'
	| 'write'
	| 'writeFlatten'
	| 'read'
	| 'compare'

export type AbstractMetaTypeCreator<T extends Record<string, unknown>> = Pick<
	MetaTypeCreator<T, '-'>,
	CommonAbstractProps
> &
	StrictOmit<MetaType, CommonAbstractProps>

export type MetaTypeCreator<
	Base extends Record<string, unknown>,
	CollectionID extends string,
	DocID extends string = string,
	Parent extends MetaType | null = null,
	Settings extends {
		allFieldsPossiblyReadAsUndefined?: boolean
		banNull?: boolean
	} = { allFieldsPossiblyReadAsUndefined: false; banNull: false }
> = RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<Base> extends infer Q
	? ObjectFlatten<Q> extends infer R
		? (Settings['banNull'] extends true ? null : never) extends infer S
			? {
					base: Base
					read: Exclude<
						ReadConverter<
							Q,
							Settings['allFieldsPossiblyReadAsUndefined'] extends true
								? undefined
								: never,
							S
						>,
						undefined
					>
					write: WriteConverter<Q, S>
					writeMerge: WriteUpdateConverter<Q, S>
					writeFlatten: WriteUpdateConverter<R, S>
					compare: CompareConverter<R, S>
					collectionID: NoUndefinedAndBannedTypes<
						string extends CollectionID
							? ErrorCollectionIDString
							: IsValidID<CollectionID, 'Collection', 'ID'>,
						never
					>
					collectionPath: Parent extends MetaType
						? `${Parent['collectionPath']}/${Parent['docID']}/${CollectionID}`
						: CollectionID
					docID: IsValidID<DocID, 'Document', 'ID'>
					docPath: Parent extends MetaType
						? `${Parent['collectionPath']}/${Parent['docID']}/${CollectionID}/${DocID}`
						: `${CollectionID}/${DocID}`
					parent: Parent
					ancestors: Parent extends MetaType
						? [
								...Parent['ancestors'],
								MetaTypeCreator<Base, CollectionID, DocID, Parent, Settings>
						  ]
						: [MetaTypeCreator<Base, CollectionID, DocID, Parent, Settings>]
			  }
			: never
		: never
	: never

// need this because bytes extends field value which is bad (admin only)
type IsBytes<T> = T extends Bytes
	? IsSame<T['toBase64'], any> extends true
		? false
		: true
	: false

type ReadConverterArray<
	T,
	allFieldsPossiblyReadAsUndefined,
	BannedTypes,
	InArray extends boolean
> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		?
				| ReadConverterArray<
						A,
						allFieldsPossiblyReadAsUndefined,
						BannedTypes,
						true
				  >[]
				| (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: IsBytes<T> extends true
		? T
		: T extends FieldValues
		? ErrorFieldValueInArray
		: T extends Date | Timestamp
		?
				| Timestamp
				| (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: T extends DocumentReference<any> | GeoPoint
		? T | (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: T extends Record<string, unknown>
		?
				| {
						[K in keyof T]-?: ReadConverterArray<
							T[K],
							allFieldsPossiblyReadAsUndefined,
							BannedTypes,
							false
						>
				  }
				| (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: T extends PossiblyReadAsUndefined
		? InArray extends true
			? ErrorPossiblyUndefinedAsArrayElement
			: undefined
		:
				| NoUndefinedAndBannedTypes<T, BannedTypes>
				| allFieldsPossiblyReadAsUndefined
>

type ReadConverter<T, allFieldsPossiblyReadAsUndefined, BannedTypes> =
	NoDirectNestedArray<
		T,
		T extends (infer A)[]
			?
					| ReadConverterArray<
							A,
							allFieldsPossiblyReadAsUndefined,
							BannedTypes,
							true
					  >[]
					| allFieldsPossiblyReadAsUndefined
			: IsBytes<T> extends true
			? T | allFieldsPossiblyReadAsUndefined
			: T extends ServerTimestamp | Date | Timestamp
			? Timestamp | allFieldsPossiblyReadAsUndefined
			: T extends DocumentReference<any> | GeoPoint
			? T | allFieldsPossiblyReadAsUndefined
			: T extends Record<string, unknown>
			?
					| {
							[K in keyof T]-?: ReadConverter<
								T[K],
								allFieldsPossiblyReadAsUndefined,
								BannedTypes
							>
					  }
					| allFieldsPossiblyReadAsUndefined
			: T extends DeleteField | PossiblyReadAsUndefined
			? undefined
			: T extends UnassignedAbleFieldValue
			? ErrorUnassignedAbleFieldValue
			:
					| NoUndefinedAndBannedTypes<T, BannedTypes>
					| allFieldsPossiblyReadAsUndefined
	>

type CompareConverterArray<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		? readonly CompareConverterArray<A, BannedTypes>[]
		: IsBytes<T> extends true
		? T
		: T extends FieldValues
		? ErrorFieldValueInArray
		: T extends Date | Timestamp
		? Timestamp | Date
		: T extends DocumentReference<any> | GeoPoint
		? T
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: CompareConverterArray<T[K], BannedTypes>
		  }
		: T extends PossiblyReadAsUndefined
		? never
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>

type CompareConverter<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		? readonly CompareConverterArray<A, BannedTypes>[]
		: IsBytes<T> extends true
		? T
		: T extends ServerTimestamp | Date | Timestamp
		? Timestamp | Date
		: T extends DocumentReference<any> | GeoPoint
		? T
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: CompareConverter<
					DeepValue<T, K & string>,
					BannedTypes
				>
		  }
		: T extends PossiblyReadAsUndefined | DeleteField
		? never
		: T extends UnassignedAbleFieldValue
		? ErrorUnassignedAbleFieldValue
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>

type ArrayWriteConverter<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		? readonly ArrayWriteConverter<A, BannedTypes>[]
		: IsBytes<T> extends true
		? T
		: T extends FieldValues
		? ErrorFieldValueInArray
		: T extends Timestamp | Date
		? Timestamp | Date
		: T extends DocumentReference<any> | GeoPoint
		? T
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: ArrayWriteConverter<T[K], BannedTypes>
		  }
		: T extends PossiblyReadAsUndefined
		? never
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>

type WriteConverter<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		?
				| readonly ArrayWriteConverter<A, BannedTypes>[]
				| ArrayUnionOrRemove<ArrayWriteConverter<A, BannedTypes>>
		: IsBytes<T> extends true
		? T
		: T extends DocumentReference<any> | ServerTimestamp | GeoPoint
		? T
		: T extends number
		? number extends T
			? T | Increment
			: T
		: T extends Timestamp | Date
		? Timestamp | Date
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: WriteConverter<T[K], BannedTypes>
		  }
		: T extends UnassignedAbleFieldValue
		? ErrorUnassignedAbleFieldValue
		: T extends PossiblyReadAsUndefined | DeleteField
		? never
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>

type WriteUpdateConverter<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		?
				| readonly ArrayWriteConverter<A, BannedTypes>[]
				| ArrayUnionOrRemove<ArrayWriteConverter<A, BannedTypes>>
		: IsBytes<T> extends true
		? T
		: T extends
				| DocumentReference<any>
				| ServerTimestamp
				| DeleteField
				| GeoPoint
		? T
		: T extends number
		? number extends T
			? T | Increment
			: T
		: T extends Timestamp | Date
		? Timestamp | Date
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: WriteUpdateConverter<
					DeepValue<T, K & string>,
					BannedTypes
				>
		  }
		: T extends UnassignedAbleFieldValue
		? ErrorUnassignedAbleFieldValue
		: T extends PossiblyReadAsUndefined
		? never
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>
