export class Utils {
    static ParseListInputs(input: string, seperator: string = ","): string[]{
        return input.split(seperator);
    }
}