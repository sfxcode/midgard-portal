export interface KampagneSchemaOptions {
  spielerLogins: string[]
}

export function useKampagneSchema() {
  function kampagneSchema(options: KampagneSchemaOptions) {
    return [
      { $formkit: 'nuxtUIInput', name: 'name', label: 'Name', validation: 'required' },
      { $formkit: 'nuxtUITextarea', name: 'beschreibung', label: 'Beschreibung' },
      {
        $formkit: 'nuxtUISelectMenu',
        name: 'spieler',
        label: 'Spieler',
        options: options.spielerLogins,
        multiple: true,
        searchInput: true
      }
    ]
  }

  return { kampagneSchema }
}
