type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

export type GetReadonlyKeys<T> = keyof {
	[K in keyof T as Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? K : never]: K
}
