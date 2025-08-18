///////////////////////////////////////////////////////////////////////////////

import type { LayoutServerLoad } from './$types';

///////////////////////////////////////////////////////////////////////////////

/*
Example config url

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

	var state = parse(tokenize(params.path));

	console.log(explore(state, 0));

	var state = state?.flatten();
	var events: number[] = [];

	// console.log(state)

	return {
		state,
		events
	};
}) satisfies LayoutServerLoad;

///////////////////////////////////////////////////////////////////////////////

type Cursor = Node | undefined;
type NodeType = string | null;

///////////////////////////////////////////////////////////////////////////////

class Node {
	parent: Cursor;
	type: NodeType;
	children: Node[];

	constructor(parent: Cursor, type: NodeType) {
		this.parent = parent;
		this.type = type;
		this.children = [];
	}

	flatten() {
		return {
			type: this.type,
			children: this.children.map((node) => node.flatten())
		};
	}
}

///////////////////////////////////////////////////////////////////////////////

const tokenize = (val: String) => {
	let res = [];
	let i = 0;
	let running = '';

	while (i < val.length) {
		if (val[i] === '(') {
			res.push('(');
			i++;
		} else if (val[i] === ')') {
			res.push(')');
			i++;
		} else if (val[i] !== ' ') {
			running += val[i];
		} else {
			res.push(running);
			running = '';
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

	let current: Cursor = undefined;

	while (i < tokens.length) {
		if (tokens[i] === '(') {
			let n: Node = new Node(current, null);
			current?.children.push(n);
			current = n;
		} else if (tokens[i] === ')') {
			current = current?.parent;
		} else if (tokens[i].match(/^[0-9]+$/)) {
			let n: Node = new Node(current, tokens[i]);
			current?.children.push(n);
			// current = n
		} else if (tokens[i].match(/^[0-9a-z]+$/)) {
			let n: Node = new Node(current, tokens[i]);
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
