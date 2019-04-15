export async function demo() {
  await shell('clear')
  await shell('tsc --project ./demo/tsconfig.json')
  await shell('node ./bin/demo/app')
}
