import { MetaType } from '../metaTypeCreator'
import { OrderByDirection } from '../alias'
import { ErrorCursorTooManyArguments, ErrorCursor__name__ } from '../error'
import {
	QueryConstraints,
	OrderByConstraint,
	CursorConstraint,
} from '../queryConstraints'
import {
	RemoveSentinelFieldPathFromCompare,
	__name__,
	GetCorrectDocumentIdBasedOnRef,
} from '../fieldPath'
import { CursorType } from '../cursor'
import { QueryDocumentSnapshot, DocumentSnapshot } from '../snapshot'
import { GetAllOrderBy } from './orderBy'
import { Query } from '../refs'

// Too many arguments provided to startAt(). The number of arguments must be less than or equal to the number of orderBy() clauses
type ValidateCursorOrderBy<
	T extends MetaType,
	Q extends Query<T>,
	Values extends unknown[],
	AllOrderBy extends OrderByConstraint<string, OrderByDirection | undefined>[]
> = Values extends [infer Head, ...infer Rest]
	? AllOrderBy extends [infer H, ...infer R]
		? H extends OrderByConstraint<string, OrderByDirection | undefined>
			? [
					H['fieldPath'] extends __name__
						? GetCorrectDocumentIdBasedOnRef<T, Q, H['fieldPath'], Head>
						: Head extends
								| T['compare'][H['fieldPath']]
								| QueryDocumentSnapshot<T>
								| DocumentSnapshot<T>
						? Head | QueryDocumentSnapshot<T> | DocumentSnapshot<T>
						:
								| T['compare'][H['fieldPath']]
								| QueryDocumentSnapshot<T>
								| DocumentSnapshot<T>,
					...ValidateCursorOrderBy<
						T,
						Q,
						Rest,
						R extends OrderByConstraint<string, OrderByDirection | undefined>[]
							? R
							: []
					>
			  ]
			: never // impossible route
		: [ErrorCursorTooManyArguments]
	: [] // end, Rest is []

export type CursorConstraintLimitation<
	T extends MetaType,
	Q extends Query<T>,
	U extends CursorConstraint<CursorType, unknown[]>,
	PreviousQCs extends QueryConstraints<T>[]
> = CursorConstraint<
	CursorType,
	ValidateCursorOrderBy<
		RemoveSentinelFieldPathFromCompare<T>,
		// @ts-expect-error
		Q,
		U['values'],
		GetAllOrderBy<T, PreviousQCs, []>
	>
>
