import { Command } from "@effect/cli"
import { BunContext } from "@effect/platform-bun"
import { Console, Effect } from "effect"

const command = Command.make("test", {}, () => Console.log("test"))

const cli = Command.run(command, {
	name: "learn-anything.xyz CLI",
	version: "v0.0.1"
})

// TODO: do this https://discord.com/channels/795981131316985866/1287372464548216883/1287395565751111792
// const run = process.env.IS_PRODUCTION ? BunRuntime.runMain : Effect.runPromise
Effect.runPromise(cli(process.argv).pipe(Effect.provide(BunContext.layer)))
