export default interface UseCase {
    execute (input: Input): Promise<Output | void>;
}

type Input = {};
type Output = {};
