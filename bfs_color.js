export class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class State {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    IsEqual(state) {
        return r==o.r && g==o.g && b==o.b;
    }
}

function StateHash(s) {
    return ((s.r * 997) ^ (s.g * 991) ^ (s.b * 983));
}

function stateKey(state) {
    return `${state.r},${state.g},${state.b}`;
}

function clampChannel(value, max) {
    return Math.max(0, Math.min(value, max));
}

/*function clamp_channel(v, cap) {
    if (v < 0) return 0;
    if (v > cap) return cap;
    return v;
}*/

export const Bugs = {
    1: "Ladybugs",
    2: "Longheaded Locusts",
    3: "Lapis Lazuli Dor Beetles",
    4: "Indian Fritillary Larvae",
    5: "Cabbage Butterfly Larvae",
    6: "Hawk Moth Larvae",
    7: "Rhinoceros Beetle Larvae",
    8: "Japanese Wood Ants"
};

export function FindBugs(curr, want, max) {
    // Bug deltas //
    const deltas = [
        [+4, -2, -2], // Ladybugs
        [-2, +4, -2], // Longheaded Locusts
        [-2, -2, +4], // Lapis Lazuli Dor Beetles
        [+7,  0,  0], // Indian Fritillary Larvae
        [ 0, +7,  0], // Cabbage Butterfly Larvae
        [ 0,  0, +7], // Hawk Moth Larvae
        [+2, +2, +2], // Rhinoceros Beetle Larvae
        [-2, -2, -2]  // Japanese Wood Ants
    ];

    // Set the caps based on maximum RGB values
    const caps = {r: max.r, g: max.g, b: max.b };

    let start = new State(curr.r, curr.g, curr.b); // Set start state to current color
    let target = new State(want.r, want.g, want.b); // Set target state to desired color

    const queue = [];

    const visited = new Set();
    const parent = new Map();

    const startKey = stateKey(start);
    queue.push(start);
    visited.add(startKey);
    parent.set(startKey, { prev: null, bug: null });

    while (queue.length > 0) {
        const current = queue.shift();
        const currentKey = stateKey(current);

        if (current.r === target.r && current.g === target.g && current.b === target.b) {
            // Found target — reconstruct path
            const path = [];
            let key = currentKey;
            while (parent.get(key).prev !== null) {
                path.push(parent.get(key).bug);
                key = parent.get(key).prev;
            }
            return path.reverse(); // Reverse to get forward order
        }

        for (let i = 0; i < deltas.length; i++) {
            const delta = deltas[i];
            const neighbor = {
                r: clampChannel(current.r + delta[0], caps.r),
                g: clampChannel(current.g + delta[1], caps.g),
                b: clampChannel(current.b + delta[2], caps.b)
            };

            const neighborKey = stateKey(neighbor);
            if (!visited.has(neighborKey)) {
                visited.add(neighborKey);
                parent.set(neighborKey, { prev: currentKey, bug: i + 1 });
                queue.push(neighbor);
            }
        }
    }

    return null; // No path found
}