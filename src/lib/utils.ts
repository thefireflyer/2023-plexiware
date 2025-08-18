////////////////////////////////////////////////////////////////////////////////

export const slog = (file: string, caller: string, m?: any, ...ps: any[]) => {
	const date = new Date();
	console.log('\x1B[2m%s %s::%s:\x1B[0m', date.toLocaleTimeString(), file, caller, m, ...ps);
};

////////////////////////////////////////////////////////////////////////////////

export const id = <T>(t: T) => {
	return t;
};

////////////////////////////////////////////////////////////////////////////////

export interface Functor<A> {
	map<B>(f: (a: A) => B): Functor<B>;
}

export interface BiFunctor<A, B> {
	bimap<C, D>(f: (a: A) => C, g: (b: B) => D): BiFunctor<C, D>;
}

////////////////////////////////////////////////////////////////////////////////

export type Either_<E, T> = { t: 'L'; d: E } | { t: 'R'; d: T };

export abstract class Either<E, T> implements Functor<T>, BiFunctor<E, T> {
	abstract either<B, U>(onL: (e: E) => B, onR: (t: T) => U): B | U;
	abstract obj(): Either_<E, T>;

	abstract map<B>(f: (x: T) => B): Either<E, B>;
	abstract bimap<B, U>(f: (a: E) => B, g: (b: T) => U): Either<B, U>;
}

export const either_ = <E, T>(obj: Either_<E, T>) => {
	if (obj.t === 'L') {
		return new Left(obj.d);
	} else {
		return new Right(obj.d);
	}
};

////////////////////////////////////////////////////////////////////////////////

export class Left<E, T> extends Either<E, T> {
	either<B, U>(onL: (e: E) => B, onR: (t: T) => U): B | U {
		return onL(this.data);
	}
	obj(): { t: 'L'; d: E } {
		return { t: 'L', d: this.data };
	}

	map<B>(f: (x: T) => B): Either<E, B> {
		return new Left(this.data);
	}
	bimap<B, U>(f: (a: E) => B, g: (b: T) => U): Either<B, U> {
		return new Left(f(this.data));
	}

	constructor(private data: E) {
		super();
	}
}

////////////////////////////////////////////////////////////////////////////////

export class Right<E, T> extends Either<E, T> {
	either<B, U>(onL: (e: E) => B, onR: (t: T) => U): B | U {
		return onR(this.data);
	}
	obj(): { t: 'R'; d: T } {
		return { t: 'R', d: this.data };
	}

	map<B>(f: (x: T) => B): Either<E, B> {
		return new Right(f(this.data));
	}
	bimap<B, U>(f: (a: E) => B, g: (b: T) => U): Either<B, U> {
		return new Right(g(this.data));
	}

	constructor(private data: T) {
		super();
	}
}

////////////////////////////////////////////////////////////////////////////////
