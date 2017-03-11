export interface TestMessage {
    type: "test";
    test: string;
}

export type AllMessages = TestMessage;