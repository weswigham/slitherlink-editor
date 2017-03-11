import solved = require("solved");
import { AllMessages } from "./messaging/messages";

self.onmessage = (msg) => {
    const { data }: { data: AllMessages } = msg;
    switch (data.type) {
        case "test": {
            console.log(`Recieved message: ${JSON.stringify(data)} - Available strategies ${solved.Slitherlink.Strategies.all().map(s => s.name).join(",")}`);
            break;
        }
    }
}