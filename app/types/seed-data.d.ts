// data/bestiarium.json is a local, git-ignored seed file that is only imported in dev builds
// (see loadWesenFromData). This declaration lets typecheck pass on a checkout without it.
declare module '*/data/bestiarium.json' {
  const value: unknown
  export default value
}
