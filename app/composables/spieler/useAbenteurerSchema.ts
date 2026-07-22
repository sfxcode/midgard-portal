export interface AbenteurerSchemaOptions {
  typNamen: string[]
  zauberNamen: string[]
}

export function useAbenteurerSchema() {
  const { addElement, addGroup } = useFormKitSchema()

  const rowFieldClass = 'flex-1 min-w-0 basis-36'
  const narrowFieldClass = 'grow-0 shrink basis-24'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function flexRow(fields: any[], fieldClass: string, columnCount = 0) {
    const styled = fields.map(field => ({ ...field, outerClass: fieldClass }))
    const filler = () => addElement('div', [], { 'class': fieldClass, 'aria-hidden': 'true' })
    const padded = columnCount > styled.length
      ? [...styled, ...Array.from({ length: columnCount - styled.length }, filler)]
      : styled
    return addElement('div', padded, { class: 'flex gap-4' })
  }

  const basisFields = [
    { $formkit: 'nuxtUIInputNumber', name: 'st', label: 'St', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'gs', label: 'Gs', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'gw', label: 'Gw', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'ko', label: 'Ko', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'in', label: 'In', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'zt', label: 'Zt', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'au', label: 'Au', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'pa', label: 'pA', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'wk', label: 'Wk', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'b', label: 'B', validation: 'required' }
  ]

  function abenteurerInputSchema(options: AbenteurerSchemaOptions) {
    return [
      flexRow([
        { $formkit: 'nuxtUIInput', name: 'name', label: 'Name', validation: 'required' },
        { $formkit: 'nuxtUIInput', name: 'spieler', label: 'Spieler', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'grad', label: 'Grad', validation: 'required' },
        { $formkit: 'nuxtUISelect', name: 'typ', label: 'Typ', options: options.typNamen, validation: 'required' }
      ], rowFieldClass, 4),
      addElement('hr'),
      flexRow([
        { $formkit: 'nuxtUIInputNumber', name: 'lp', label: 'LP', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'ap', label: 'AP', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'gg', label: 'GG', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'sg', label: 'SG', validation: 'required' }
      ], narrowFieldClass, 4),
      flexRow([
        { $formkit: 'nuxtUIInputNumber', name: 'angriff', label: 'Angriff', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'raufen', label: 'Raufen', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'abwehr', label: 'Abwehr', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'zaubern', label: 'Zaubern', validation: 'required' }
      ], narrowFieldClass, 4),
      flexRow([
        { $formkit: 'nuxtUIInputNumber', name: 'resistenzGeist', label: 'Res-Geist', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'resistenzKoerper', label: 'Res-Körper', validation: 'required' }
      ], narrowFieldClass, 4),
      addElement('hr'),
      addElement('div', [
        addElement('b', ['Basis-Eigenschaften'], { class: 'mb-2 block' }),
        addGroup('basis', [flexRow(basisFields, narrowFieldClass)])
      ]),
      addElement('hr'),
      {
        $formkit: 'nuxtUISelectMenu',
        name: 'zauber',
        label: 'Zauber',
        options: options.zauberNamen,
        multiple: true,
        searchInput: true
      }
    ]
  }

  return { abenteurerInputSchema }
}
