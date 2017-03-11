import solved = require("solved");
import { curry } from "./util/functions";
import { mkelement, render, html } from "./util/rendering";
import { TestMessage, AllMessages } from "./messaging/messages";

const worker = new Worker("./dist/worker.js");

const p = curry(mkelement, "p");
const a = curry(mkelement, "a");
const div = curry(mkelement, "div");
const b = curry(mkelement, "b");

window.onload = () => {
    render("main", p(() => html`Test - ${b(`Slitherlink`)} strategies available: ${solved.Slitherlink.Strategies.all().map(s => s.name).join(",")}`));
    const m1: TestMessage = { test: "A message", type: "test" };
    worker.postMessage(m1);
    console.log("Sent message to worker!");
}
