export interface StammFormField {
  $formkit: string
  name: string
  label?: string
  validation?: string
  options?: string[] | Array<{ label: string, value: unknown }>
  fullWidth?: boolean
}

export interface ZauberSchemaOptions {
  kategorien: string[]
  arten: string[]
  prozesse: string[]
  zauberdauern: string[]
}

export interface FertigkeitSchemaOptions {
  kategorien: string[]
  schwierigkeiten: string[]
}

export interface TypSchemaOptions {
  kategorien: string[]
}

function layout(fields: StammFormField[]) {
  return [
    {
      $el: 'div',
      attrs: { class: 'stamm-form-grid' },
      children: fields.map(({ fullWidth, ...field }) =>
        fullWidth ? { ...field, outerClass: 'stamm-form-field-full' } : field)
    }
  ]
}

export function useStammSchemas() {
  const stufen = Array.from({ length: 12 }, (_, i) => ({ label: String(i + 1), value: i + 1 }))

  function zauberSchema(options: ZauberSchemaOptions) {
    return layout([
      { $formkit: 'nuxtUIInput', name: 'name', label: 'Name', validation: 'required' },
      { $formkit: 'nuxtUISelect', name: 'kategorie', label: 'Kategorie', options: options.kategorien },
      { $formkit: 'nuxtUISelect', name: 'art', label: 'Art', options: options.arten },
      { $formkit: 'nuxtUISelect', name: 'stufe', label: 'Stufe', options: stufen },
      { $formkit: 'nuxtUIInput', name: 'ap', label: 'AP-Verbrauch' },
      { $formkit: 'nuxtUISelect', name: 'zauberdauer', label: 'Zauberdauer', options: options.zauberdauern },
      { $formkit: 'nuxtUIInput', name: 'reichweite', label: 'Reichweite' },
      { $formkit: 'nuxtUIInput', name: 'wirkungsziel', label: 'Wirkungsziel' },
      { $formkit: 'nuxtUIInput', name: 'wirkungsbereich', label: 'Wirkungsbereich' },
      { $formkit: 'nuxtUIInput', name: 'wirkungsdauer', label: 'Wirkungsdauer' },
      { $formkit: 'nuxtUIInput', name: 'ursprung', label: 'Ursprung' },
      { $formkit: 'nuxtUISelect', name: 'prozess', label: 'Prozess', options: options.prozesse },
      { $formkit: 'nuxtUIInput', name: 'agens', label: 'Agens' },
      { $formkit: 'nuxtUIInput', name: 'reagens', label: 'Reagens' },
      { $formkit: 'nuxtUIInput', name: 'material', label: 'Material' },
      { $formkit: 'nuxtUITextarea', name: 'spruch', label: 'Spruch', fullWidth: true }
    ])
  }

  function fertigkeitSchema(options: FertigkeitSchemaOptions) {
    return layout([
      { $formkit: 'nuxtUIInput', name: 'name', label: 'Name', validation: 'required' },
      { $formkit: 'nuxtUISelect', name: 'kategorie', label: 'Kategorie', options: options.kategorien },
      { $formkit: 'nuxtUIInput', name: 'leitwert', label: 'Leitwert' },
      { $formkit: 'nuxtUIInputNumber', name: 'ungelernt', label: 'Ungelernt' },
      { $formkit: 'nuxtUIInputNumber', name: 'gelernt', label: 'Gelernt' },
      { $formkit: 'nuxtUISelect', name: 'schwierigkeit', label: 'Schwierigkeit', options: options.schwierigkeiten },
      { $formkit: 'nuxtUIInputNumber', name: 'lerneinheiten', label: 'Lerneinheiten' },
      { $formkit: 'nuxtUIInput', name: 'art', label: 'Art' },
      { $formkit: 'nuxtUIInput', name: 'buch', label: 'Buch' }
    ])
  }

  function typSchema(options: TypSchemaOptions) {
    return layout([
      { $formkit: 'nuxtUIInput', name: 'name', label: 'Name', validation: 'required' },
      { $formkit: 'nuxtUIInput', name: 'nameKurz', label: 'Name kurz' },
      { $formkit: 'nuxtUISelect', name: 'kategorie', label: 'Kategorie', options: options.kategorien },
      { $formkit: 'nuxtUIInputTags', name: 'zauberTypen', label: 'Zauber-Typen', fullWidth: true },
      { $formkit: 'nuxtUIInputTags', name: 'zauberProzesse', label: 'Zauber-Prozesse', fullWidth: true },
      { $formkit: 'nuxtUIInputTags', name: 'basisFertigkeiten', label: 'Basis-Fertigkeiten', fullWidth: true },
      { $formkit: 'nuxtUIInputTags', name: 'basisZauber', label: 'Basis-Zauber', fullWidth: true },
      { $formkit: 'nuxtUIInputNumber', name: 'alltag', label: 'Alltag' },
      { $formkit: 'nuxtUIInputNumber', name: 'freiland', label: 'Freiland' },
      { $formkit: 'nuxtUIInputNumber', name: 'halbwelt', label: 'Halbwelt' },
      { $formkit: 'nuxtUIInputNumber', name: 'kampf', label: 'Kampf' },
      { $formkit: 'nuxtUIInputNumber', name: 'koerper', label: 'Körper' },
      { $formkit: 'nuxtUIInputNumber', name: 'sozial', label: 'Sozial' },
      { $formkit: 'nuxtUIInputNumber', name: 'unterwelt', label: 'Unterwelt' },
      { $formkit: 'nuxtUIInputNumber', name: 'waffen', label: 'Waffen' },
      { $formkit: 'nuxtUIInputNumber', name: 'wissen', label: 'Wissen' },
      { $formkit: 'nuxtUIInputNumber', name: 'zauber', label: 'Zauber (Punkte)' },
      { $formkit: 'nuxtUIInput', name: 'buch', label: 'Buch' }
    ])
  }

  return { zauberSchema, fertigkeitSchema, typSchema }
}
