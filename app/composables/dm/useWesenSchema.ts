export interface WesenSchemaOptions {
  kategorien: string[]
  regionen: string[]
  ruestungen: string[]
}

export function useWesenSchema() {
  const { addElement, addGroup } = useFormKitSchema()

  // A field's flex-basis is an explicit value (never FormKit's default
  // 'auto'), which stops the flex algorithm falling back to the blanket
  // ".formkit-outer { width: 100% }" rule (see formkit.css) — so plain
  // Tailwind/Uno utilities are enough, no dedicated CSS class needed.
  const rowFieldClass = 'flex-1 min-w-0 basis-36'
  const narrowFieldClass = 'grow-0 shrink basis-20'
  const compactFieldClass = 'grow-0 shrink basis-40'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function flexRow(fields: any[], fieldClass: string, columnCount = 0, rowClass = '') {
    const styled = fields.map(field => ({ ...field, outerClass: fieldClass }))
    const filler = () => addElement('div', [], { class: fieldClass, 'aria-hidden': 'true' })
    const padded = columnCount > styled.length
      ? [...styled, ...Array.from({ length: columnCount - styled.length }, filler)]
      : styled
    return addElement('div', padded, { class: `flex gap-4 ${rowClass}`.trim() })
  }

  function repeater(name: string, label: string, insertButtonLabel: string, newItem: Record<string, unknown>, fields: unknown[]) {
    return {
      $formkit: 'nuxtUIRepeater',
      name,
      label,
      insertButtonLabel,
      newItem,
      listClass: '',
      listItemClass: 'flex gap-4 mb-2',
      buttonGroupClass: 'flex gap-1.5 mt-4',
      buttonClass: 'mt-5',
      draggable: true,
      hideMoveButtons: true,
      displayDragHandle: true,
      displayDeleteButton: true,
      displayAddButton: true,
      // flex-none: this row must not grow to fill the remaining width next
      // to the (content-sized) actions column it sits beside in the item.
      children: [flexRow(fields, compactFieldClass, 0, '')]
    }
  }

  const modifikatorFields = [
    { $formkit: 'nuxtUIInputNumber', name: 'grad', label: 'Grad', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'gf', label: 'Gf', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'st', label: 'St', validation: 'required' },
    { $formkit: 'nuxtUIInput', name: 'lp', label: 'LP' },
    { $formkit: 'nuxtUIInput', name: 'ap', label: 'AP' },
    { $formkit: 'nuxtUIInput', name: 'schaden', label: 'Schaden' },
    { $formkit: 'nuxtUIInputNumber', name: 'angriff', label: 'Angriff', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'abwehr', label: 'Abwehr', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'resistenzGeist', label: 'Res-G', validation: 'required' },
    { $formkit: 'nuxtUIInputNumber', name: 'resistenzKoerper', label: 'Res-K', validation: 'required' }
  ]

  function modifikatorGroup(name: string, label: string) {
    return addElement('div', [
      addElement('b', [label], { class: 'mb-2 block' }),
      addGroup(name, [flexRow(modifikatorFields, narrowFieldClass)])
    ], { class: '' })
  }

  function wesenSchema(options: WesenSchemaOptions) {
    return [
      flexRow([
        { $formkit: 'nuxtUIInputNumber', name: 'grad', label: 'Grad', validation: 'required' },
        { $formkit: 'nuxtUISelect', name: 'kategorie', label: 'Gruppe', options: options.kategorien },
        { $formkit: 'nuxtUIInputTags', name: 'regionen', label: 'Regionen' },
        { $formkit: 'nuxtUIInput', name: 'vorkommen', label: 'Vorkommen' }
      ], rowFieldClass, 5),
      addElement('hr'),
      flexRow([
        { $formkit: 'nuxtUIInput', name: 'lp', label: 'LP', validation: 'required' },
        { $formkit: 'nuxtUIInput', name: 'ap', label: 'AP', validation: 'required' },
        { $formkit: 'nuxtUISelect', name: 'ruestung', label: 'Rüstung', options: options.ruestungen },
        { $formkit: 'nuxtUIInputNumber', name: 'gf', label: 'Gf', validation: 'required' }
      ], rowFieldClass, 5),
      flexRow([
        { $formkit: 'nuxtUIInputNumber', name: 'st', label: 'St', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'gw', label: 'Gw', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'in', label: 'In', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'b', label: 'Bewegung', validation: 'required' }
      ], rowFieldClass, 5),
      flexRow([
        { $formkit: 'nuxtUIInputNumber', name: 'abwehr', label: 'Abwehr', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'resistenzGeist', label: 'Resistenz-Geist', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'resistenzKoerper', label: 'Resistenz-Körper', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'fliegend', label: 'Bewegung Luft', validation: 'required' },
        { $formkit: 'nuxtUIInputNumber', name: 'mw', label: 'MW' }
      ], rowFieldClass, 5),
      addElement('hr'),
      repeater('angriffe', 'Angriff', 'Neuer Angriff', { name: '', wert: 0, schaden: '', bemerkung: '' }, [
        { $formkit: 'nuxtUIInput', name: 'name', label: 'Name' },
        { $formkit: 'nuxtUIInputNumber', name: 'wert', label: 'Wert' },
        { $formkit: 'nuxtUIInput', name: 'schaden', label: 'Schaden' },
        { $formkit: 'nuxtUIInput', name: 'bemerkung', label: 'Bemerkung' }
      ]),
      addElement('hr'),
      repeater('besonderheiten', 'Neue Besonderheit', 'Besonderheit', { name: '', wert: 0, bemerkung: '' }, [
        { $formkit: 'nuxtUIInput', name: 'name', label: 'Name' },
        { $formkit: 'nuxtUIInputNumber', name: 'wert', label: 'Wert' },
        { $formkit: 'nuxtUIInput', name: 'bemerkung', label: 'Bemerkung' }
      ]),
      addElement('hr'),
      repeater('zauber', 'Zauber', 'Neuer Zauber', { name: '', wert: 0, bemerkung: '' }, [
        { $formkit: 'nuxtUIInput', name: 'name', label: 'Name' },
        { $formkit: 'nuxtUIInputNumber', name: 'wert', label: 'Wert' },
        { $formkit: 'nuxtUIInput', name: 'bemerkung', label: 'Bemerkung' }
      ]),
      addElement('hr'),
      modifikatorGroup('erfahren', 'Erfahren'),
      modifikatorGroup('selten', 'Selten'),
      modifikatorGroup('legendaer', 'Legendär')
    ]
  }

  return { wesenSchema }
}
