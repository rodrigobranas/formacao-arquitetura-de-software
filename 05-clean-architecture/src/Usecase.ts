export default interface Usecase {
    execute (input: Input): Promise<Output | void>;
}

type Input = {};
type Output = {};
