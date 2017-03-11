import solved = require("solved");
import { curry } from "./util/functions";
import { mkelement, render, html } from "./util/rendering";
import { TestMessage, AllMessages } from "./messaging/messages";

const worker = new Worker("./dist/worker.js");

const p = curry(mkelement, "p");
const a = curry(mkelement, "a");
const div = curry(mkelement, "div");
const b = curry(mkelement, "b");
const h1 = curry(mkelement, "h1");
const small = curry(mkelement, "small");
const input = curry(mkelement, "input");
const br = curry(mkelement, "br");
const table = curry(mkelement, "table");
const tr = curry(mkelement, "tr");
const td = curry(mkelement, "td");
const button = curry(mkelement, "button");

window.onload = () => {
    render("main", PageBody());
    const m1: TestMessage = { test: "A message", type: "test" };
    worker.postMessage(m1);
    console.log("Sent message to worker!");
}

type GridState = " " | "X" | "1" | "2" | "3";
interface OneTrueState {
    x: number;
    y: number;
    elements: {value: GridState}[][]
}

const gridStateMembers: GridState[] = [" ", "X", "1", "2", "3"];
const SlitherlinkGridElement = (state: OneTrueState, x: number, y: number) => button({onclick: (_: any, elem: HTMLElement) => {
    const value = state.elements[x][y].value;
    const newValue = gridStateMembers[(gridStateMembers.indexOf(value) + 1) % gridStateMembers.length];
    state.elements[x][y].value = newValue;
    render("main", PageBody(state));
}, style: `min-width: 30px; min-height: 30px;`}, state.elements[x][y].value);

function similar(a: GridState, b: GridState) {
    return a === " " ? b === " " : b !== " ";
}

const CheckSymmetry = (state: OneTrueState) => {
    const brokenSymmetries = {
        rotational: false,
        horizonal: false,
        vertical: false,
    }
    for (let x = 0; x<state.x; x++) {
        for (let y = 0; y<state.y; y++) {
            if (!similar(state.elements[x][y].value, state.elements[state.x - x - 1][state.y - y - 1].value)) {
                brokenSymmetries.rotational = true;
            }
            if (!similar(state.elements[x][y].value, state.elements[x][state.y - y - 1].value)) {
                brokenSymmetries.vertical = true;
            }
            if (!similar(state.elements[x][y].value, state.elements[state.x - x - 1][y].value)) {
                brokenSymmetries.horizonal = true;
            }
        }
    }
    return Object.keys(brokenSymmetries).map(k => p(`${k} symmetry ${(brokenSymmetries as any)[k] ? "❌" : "✔️️"}`));
}

const PageBody = (state: OneTrueState = {x: 10, y: 10, elements: Array(10).fill(0).map(_ => Array(10).fill(0).map(_ => ({value: " "}))) as ({value: GridState})[][]}) => div(html`
    ${h1(html`Slitherlink - ${small(`A puzzle creation aid`)}`)}
    columns: ${input({id: "x", type: "number", min: 3, max: 40, value: state.x, oninput: (_: any, elem: HTMLInputElement) => {
        state.x = +elem.value;
        render("main", PageBody(state));
    }})}
    rows: ${input({id: "y", type: "number", min: 3, max: 40, value: state.y, oninput: (_: any, elem: HTMLInputElement) => {
        state.y = +elem.value;
        render("main", PageBody(state));
    }})}

    ${table(html`
        ${Array(state.y).fill("y").map((_, y) => tr(html`
            ${Array(state.x).fill("x").map((_, x) => {
                state.elements[x] = state.elements[x] || Array(state.x);
                state.elements[x][y] = state.elements[x][y] || { value: " " };
                return td(SlitherlinkGridElement(state, x, y));
            })}
        `))}
    `)}

    ${CheckSymmetry(state)}
`);