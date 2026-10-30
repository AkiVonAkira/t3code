import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import { Command, Flag } from "effect/cli";

import { main as runServiceLauncher } from "../serviceLauncher.ts";

/** The launcher must stop its child before exiting; `runMain` would interrupt that shutdown. */
export const serviceLauncherCommand = Command.make("__service-launcher", {
  baseDir: Flag.String("base-dir").pipe(Flag.optional),
  logFile: Flag.String("log-file").pipe(Flag.optional),
  serviceUnit: Flag.String("service-unit").pipe(Flag.optional),
}).pipe(
  Command.unlisted,
  Command.withHandler((flags) =>
    Effect.sync(() => {
      runServiceLauncher({
        baseDir: Option.getOrUndefined(flags.baseDir),
        logFile: Option.getOrUndefined(flags.logFile),
        serviceUnit: Option.getOrUndefined(flags.serviceUnit),
      }).catch((cause: unknown) => {
        const error = cause instanceof Error ? cause : new Error(String(cause));
        process.stderr.write(`[service-launcher] ${error.message}\n`);
        process.exitCode = 1;
      });
    }),
  ),
);
