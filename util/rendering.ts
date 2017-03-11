export function findElem(id: string) {
    return document.getElementById(id);
}

let handlerid = 0;
let handlers: {[index: number]: (value: Event, elem?: HTMLElement) => void} = {};

(window as any)._eventFired = (object: HTMLElement, event: Event, handlerid: number) => {
    if (!handlers[handlerid]) return;
    handlers[handlerid](event, object);
};

export function mkelement(kind: string, propsOrBody?: {[name: string]: string | number | ((value: Event, elem?: HTMLElement) => void)} | ((() => HTMLElement | string) | string | HTMLElement), body?: (() => HTMLElement | string) | string | HTMLElement) {
    const elem = document.createElement(kind);
    if (!propsOrBody) return elem;
    if (typeof propsOrBody !== "function" && typeof propsOrBody !== "string" && !(propsOrBody instanceof HTMLElement)) {
        for (const [key, value] of Object.keys(propsOrBody).map(p => [p, propsOrBody[p]]) as [string, string | number | ((value: Event, elem?: HTMLElement) => void)][]) {
            if (typeof value === "function") {
                handlerid++;
                handlers[handlerid] = value;
                elem.setAttribute(key, `_eventFired(this, event, ${handlerid})`);
            }
            else {
                elem.setAttribute(key, ""+value);
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
        else if (typeof body === "string") {
            elem.innerHTML = body;
        }
        else {
            elem.innerHTML = body.outerHTML;
        }
    }
    return elem;
}

export function render(id: string | HTMLElement, elem: HTMLElement) {
    if (typeof id === "string") {
        findElem(id).innerHTML = elem.outerHTML;
    }
    else {
        id.outerHTML = elem.outerHTML;
    }
}

export function html(literals: TemplateStringsArray, ...placeholders: (string | HTMLElement | (string | HTMLElement)[])[]) {
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