import solved = require("solved");

function element(id: string) {
    return document.getElementById(id);
}

const worker = new Worker("./dist/worker.js");

window.onload = () => {
    element("main").innerHTML = `<p>Test - Slitherlink strategies available: ${solved.Slitherlink.Strategies.all().map(s => s.name).join(",")}</p>`;
    worker.postMessage({test: "A message"});
}
