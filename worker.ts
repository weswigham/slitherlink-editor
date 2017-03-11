import solved = require("solved");

self.onmessage = (msg) => {
    console.log(`Recieved message: ${JSON.stringify(msg)} - Available strategies ${solved.Slitherlink.Strategies.all().map(s => s.name).join(",")}`);
}