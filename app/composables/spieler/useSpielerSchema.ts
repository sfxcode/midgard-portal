export function useSpielerSchema() {
  function spielerProfilSchema() {
    return [
      { $formkit: 'nuxtUIInput', name: 'name', label: 'Name', validation: 'required' },
      { $formkit: 'nuxtUIInput', name: 'email', label: 'E-Mail' },
      { $formkit: 'nuxtUIInput', name: 'avatar', label: 'Avatar-URL' }
    ]
  }

  return { spielerProfilSchema }
}
