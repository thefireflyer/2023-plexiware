///////////////////////////////////////////////////////////////////////////////

import { slog } from '$lib/utils';
import type { LayoutServerLoad } from './$types';

///////////////////////////////////////////////////////////////////////////////

/*
Example config url

http://localhost:5173/w/(%20h%20(%20note%200%20)%20(%20v%20(%20note%200%20)%20(%20note%201%20)%20)%20)

/( 
    h 
    index 
    (
        v
        ( note 0 )
        ( note 1 )
    )
    schedule
)



--- Example notes page ---


(head
    (id 000-000-000)
    (title "Test"))

(toc)

(anchor :intro
    (h 1 "Introduction"))

(rel :motivation :eq
    (text "..."))



--- Example notes pages 2 ---


(head 
    (title "Jan 5, 2024")
    (type :journal))

(ul
    morning-checklist
    (li (b "main")
        (ul 
            (todo "shower")
            (todo "shave")
            bl
            (todo "read" (i "Gideon the ninth"))))
    night-checklist)

*/

///////////////////////////////////////////////////////////////////////////////

export const load = (async ({ params, request }) => {
	console.log(params);
	if (params.path === '') {
		params.path = '(h (note 0) (v (note 1) (note 2)))';
	}

	const src = parse(tokenize(params.path));
	explore(src, 0);

	const state = src?.flatten();
	const events: number[] = [];

	return {
		state,
		events
	};
}) satisfies LayoutServerLoad;

///////////////////////////////////////////////////////////////////////////////

/*
S0 = S1
	 | S0 ' ' S1
S1 = '(' S0 ')'
	 | Idn0
	 | Num0
	 | Str0
Idn0 = ([a-Z] | '_' | ':') (!('.' | ' '))*
Num0 = [0-9]+
	   | [0-9]* '.' [0-9]+
Str0 = '"' Str1
Str1 = !('\' | '"') Str1
		 | '\"' Str1
		 | '"'
*/

type ST = 'horz' | 'vert' | 'note';
type SE = { t: 'app'; x: ST; ts: SE[] } | S1;
type S1 = { t: 'idn'; x: string } | { t: 'num'; x: number } | { t: 'str'; x: string };

const parseSE = (src: string) => {};

///////////////////////////////////////////////////////////////////////////////

type Cursor = Node | undefined;
type NodeType = string | null;

///////////////////////////////////////////////////////////////////////////////

type NodeFlt = { type: NodeType; children: NodeFlt[] };
class Node {
	parent: Cursor;
	type: NodeType;
	children: Node[];

	constructor(parent: Cursor, type: NodeType) {
		this.parent = parent;
		this.type = type;
		this.children = [];
	}

	flatten(): NodeFlt {
		return {
			type: this.type,
			children: this.children.map((node) => node.flatten())
		};
	}
}

///////////////////////////////////////////////////////////////////////////////

const tokenize = (val: string) => {
	const res = [];
	let i = 0;
	let running = '';

	while (i < val.length) {
		if (val[i] === '(') {
			res.push(running);
			running = '';
			res.push('(');
		} else if (val[i] === ')') {
			res.push(running);
			running = '';
			res.push(')');
		} else if (val[i] === ' ') {
			res.push(running);
			running = '';
		} else {
			running += val[i];
		}

		i++;
	}

	return res;
};

///////////////////////////////////////////////////////////////////////////////

const parse = (tokens: string[]) => {
	tokens.pop();
	// console.log(tokens)

	let i = 0;

	let current = undefined as Cursor;

	while (i < tokens.length) {
		if (tokens[i] === '(') {
			const n: Node = new Node(current, null);
			current?.children.push(n);
			current = n;
		} else if (tokens[i] === ')') {
			current = current?.parent;
		} else if (tokens[i].match(/^[0-9]+$/)) {
			const n: Node = new Node(current, tokens[i]);
			current?.children.push(n);
			// current = n
		} else if (tokens[i].match(/^[0-9a-z]+$/)) {
			const n: Node = new Node(current, tokens[i]);
			current?.children.push(n);
			// current = n
		}
		i++;
	}

	return current;
};

///////////////////////////////////////////////////////////////////////////////

const explore = (node: Cursor, level: number) => {
	if (node) {
		console.log(
			Array(level)
				.fill('|   ')
				.reduce((r, i) => r + i, '') + node.type
		);
		node.children.forEach((node) => explore(node, level + 1));
	}
};

///////////////////////////////////////////////////////////////////////////////
