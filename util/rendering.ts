export function findElem(id: string) {
    return document.getElementById(id);
}

export function mkelement(kind: string, propsOrBody?: {[name: string]: string} | (() => HTMLElement | string), body?: () => HTMLElement | string) {
    const elem = document.createElement(kind);
    if (!propsOrBody) return elem;
    if (typeof propsOrBody !== "function") {
        for (const [key, value] of Object.keys(propsOrBody).map(p => [p, propsOrBody[p]])) {
            elem.setAttribute(key, value);
        }
    }
    else {
        body = propsOrBody;
    }
    if (body) {
        const result = body();
        elem.innerHTML = typeof result === "string" ? result : result.outerHTML;
    }
    return elem;
}

export function render(id: string, elem: HTMLElement) {
    findElem(id).innerHTML = elem.outerHTML;
}

export function html(literals: TemplateStringsArray, ...placeholders: (string | HTMLElement)[]) {
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
            result += p.outerHTML;
        }
    }

    // add the last literal
    result += literals[literals.length - 1];
    return result;
}