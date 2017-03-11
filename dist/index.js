(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("./util/functions");
const rendering_1 = require("./util/rendering");
const worker = new Worker("./dist/worker.js");
const p = functions_1.curry(rendering_1.mkelement, "p");
const a = functions_1.curry(rendering_1.mkelement, "a");
const div = functions_1.curry(rendering_1.mkelement, "div");
const b = functions_1.curry(rendering_1.mkelement, "b");
const h1 = functions_1.curry(rendering_1.mkelement, "h1");
const small = functions_1.curry(rendering_1.mkelement, "small");
const input = functions_1.curry(rendering_1.mkelement, "input");
const br = functions_1.curry(rendering_1.mkelement, "br");
const table = functions_1.curry(rendering_1.mkelement, "table");
const tr = functions_1.curry(rendering_1.mkelement, "tr");
const td = functions_1.curry(rendering_1.mkelement, "td");
window.onload = () => {
    rendering_1.render("main", pageBody());
    const m1 = { test: "A message", type: "test" };
    worker.postMessage(m1);
    console.log("Sent message to worker!");
};
const pageBody = (state = { x: 10, y: 10 }) => div(rendering_1.html `
    ${h1(rendering_1.html `Slitherlink - ${small(`A puzzle creation aid`)}`)}
    columns: ${input({ id: "x", type: "number", min: 3, max: 40, value: state.x, oninput: (value, elem) => {
        state.x = +elem.value;
        rendering_1.render("main", pageBody(state));
    } })}
    rows: ${input({ id: "y", type: "number", min: 3, max: 40, value: state.y, oninput: (value, elem) => {
        state.y = +elem.value;
        rendering_1.render("main", pageBody(state));
    } })}
    ${br()}

    ${table(rendering_1.html `
        ${Array(state.y).fill("y").map(_ => tr(rendering_1.html `
            ${Array(state.x).fill("x").map(_ => td(`X`))}
        `))}
    `)}
`);

},{"./util/functions":2,"./util/rendering":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function curry(f, arg) {
    return (...args) => f(arg, ...args);
}
exports.curry = curry;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findElem(id) {
    return document.getElementById(id);
}
exports.findElem = findElem;
let handlerid = 0;
let handlers = {};
window._eventFired = (object, event, handlerid) => {
    if (!handlers[handlerid])
        return;
    handlers[handlerid](event, object);
};
function mkelement(kind, propsOrBody, body) {
    const elem = document.createElement(kind);
    if (!propsOrBody)
        return elem;
    if (typeof propsOrBody !== "function" && typeof propsOrBody !== "string") {
        for (const [key, value] of Object.keys(propsOrBody).map(p => [p, propsOrBody[p]])) {
            if (typeof value === "function") {
                handlerid++;
                handlers[handlerid] = value;
                elem.setAttribute(key, `_eventFired(this, event, ${handlerid})`);
            }
            else {
                elem.setAttribute(key, "" + value);
            }
        }
    }
    else {
        body = propsOrBody;
    }
    if (body) {
        if (typeof body === "function") {
            const result = body();
            elem.innerHTML = typeof result === "string" ? result : result.outerHTML;
        }
        else {
            elem.innerHTML = body;
        }
    }
    return elem;
}
exports.mkelement = mkelement;
function render(id, elem) {
    findElem(id).innerHTML = elem.outerHTML;
}
exports.render = render;
function html(literals, ...placeholders) {
    let result = "";
    // interleave the literals with the placeholders
    for (let i = 0; i < placeholders.length; i++) {
        result += literals[i];
        const p = placeholders[i];
        if (typeof p === "string") {
            result += p
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }
        else {
            if (p instanceof Array) {
                result += p.map(p => typeof p === "string" ? p : p.outerHTML).join("");
            }
            else {
                result += p.outerHTML;
            }
        }
    }
    // add the last literal
    result += literals[literals.length - 1];
    return result;
}
exports.html = html;

},{}]},{},[1]);
