export interface SpielergruppeSchemaOptions {
  spielerLogins: string[]
}

export function useSpielergruppeSchema() {
  function spielergruppeSchema(options: SpielergruppeSchemaOptions) {
    return [
      { $formkit: 'nuxtUIInput', name: 'name', label: 'Name', validation: 'required' },
      { $formkit: 'nuxtUITextarea', name: 'beschreibung', label: 'Beschreibung' },
      {
        $formkit: 'nuxtUISelectMenu',
        name: 'mitglieder',
        label: 'Mitglieder',
        options: options.spielerLogins,
        multiple: true,
        searchInput: true
      }
    ]
  }

  return { spielergruppeSchema }
}
