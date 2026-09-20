import type {WesenGeneratorRequest, WesenGeneratorResult, Zauber} from '~/models'

export function useWesenGenerator() {
  const {wesenByName} = useBestiariumStore()
  const {zauberByName} = useZauberStore()

  function generateWesen(request: WesenGeneratorRequest): WesenGeneratorResult | undefined {
    const wesen = wesenByName(request.wesen)
    const zauber: Zauber[] = wesen?.zauber.map(z => zauberByName(z.name)).filter((z): z is NonNullable<typeof z> => z !== null && z !== undefined) ?? []
    if (wesen)
      return {wesen, zauber, standard: [], erfahren: [], selten: [], legendaer: []}
    else
      return undefined
  }


  return { generateWesen }
}
