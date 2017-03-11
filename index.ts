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

window.onload = () => {
    render("main", pageBody());
    const m1: TestMessage = { test: "A message", type: "test" };
    worker.postMessage(m1);
    console.log("Sent message to worker!");
}

const pageBody = (state = {x: 10, y: 10}) => div(html`
    ${h1(html`Slitherlink - ${small(`A puzzle creation aid`)}`)}
    columns: ${input({id: "x", type: "number", min: 3, max: 40, value: state.x, oninput: (value, elem: HTMLInputElement) => {
        state.x = +elem.value;
        render("main", pageBody(state));
    }})}
    rows: ${input({id: "y", type: "number", min: 3, max: 40, value: state.y, oninput: (value, elem: HTMLInputElement) => {
        state.y = +elem.value;
        render("main", pageBody(state));
    }})}
    ${br()}

    ${table(html`
        ${Array(state.y).fill("y").map(_ => tr(html`
            ${Array(state.x).fill("x").map(_ => td(`X`))}
        `))}
    `)}
`);