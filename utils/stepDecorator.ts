import { test } from '@playwright/test';

export function step(stepName?: string) {
    return function <This, Args extends any[], Return>(
        target: (this: This, ...args: Args) => Promise<Return>,
        context: ClassMethodDecoratorContext
    ) {
        const methodName = String(context.name);
        return function (this: This, ...args: Args): Promise<Return> {
            const name = stepName ?? methodName;
            return test.step(name, async () => target.apply(this, args));
        };
    };
}
