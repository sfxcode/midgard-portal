---
name: add-stammdaten-view
description: Add or edit a *View.vue component (Stammdaten or DM family) that's used both as a read-only list preview and as an editable detail page — the onSave-optional convention that prevents a broken edit button in preview context.
triggers:
  - "View.vue"
  - "onSave"
  - "preview popover"
  - "edit mode"
  - "stammdaten"
  - "TypView"
  - "ZauberView"
  - "FertigkeitView"
  - "WesenView"
edges:
  - target: context/conventions.md
    condition: for the full pattern statement and other codebase conventions
  - target: patterns/add-list-page.md
    condition: when wiring this component into a list's preview popover column
grounds_to:
  - node: "function:f86dca787a37112a1964b48e84c0081f"
    fingerprint: "mh:64:7b226d696e68617368223a5b32313037323131302c323737393737382c3138313534353431352c34353832353237342c31353435343230392c38373233303439392c36343031353331352c3130333434373737352c33363137323236302c32333232373733322c393039393633342c3132353037333139332c3132303932323132342c32313034343836352c31333137393237352c33393031323535312c3130323034333833392c32323735383433332c39353233393039392c31313231303536392c3136383232343631332c3131343830343532322c36323133373335322c39383836363636342c323631383338342c32303430393930312c323034383432372c313134303036392c31333932313732322c33303137303038372c323837353037322c33323235313138362c34303830383232342c343830323437332c37313237363538332c313934333631382c32333831333630342c33303433313536342c31303032353038372c34363537363035382c3139363538313034352c32393232323236382c3832363536312c31303137373432342c32333330343039302c35393335333630362c32363234373734362c3134333839343531322c31383133313830342c32323934333537332c31353233393731392c39313432393436322c3131363836363834352c32383733303334302c31303934343537352c31343139343035362c32323735333834372c3131353132343738382c37343137353833342c37333137323638362c36333031343734302c31303235313538332c3133333932393831362c31313732363932355d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a3130347d"
  - node: "function:31f5ae8475ef02364005bc94408fb933"
    fingerprint: "mh:64:7b226d696e68617368223a5b32313037323131302c323737393737382c3138313534353431352c34353832353237342c31353435343230392c38373233303439392c36343031353331352c3130333434373737352c33363137323236302c32373536353437312c31373931303839362c3132353037333139332c3132303932323132342c32313034343836352c31333137393237352c35313139373838332c3135363338303933342c32323735383433332c39353233393039392c31313231303536392c3139383538353734342c3131343830343532322c36323133373335322c39383836363636342c323631383338342c3132323734373736382c323034383432372c313134303036392c39333039313239342c33303137303038372c323837353037322c36373739373735362c34303830383232342c343830323437332c37313237363538332c313934333631382c32333831333630342c33303433313536342c31303032353038372c34363537363035382c3139363538313034352c32393232323236382c3832363536312c31303137373432342c32333330343039302c35393335333630362c32363234373734362c3134333839343531322c34303434373932392c32323934333537332c31353233393731392c39313432393436322c3131363836363834352c32383733303334302c35373837363530312c37303230383532362c32323735333834372c3131353132343738382c37343137353833342c37383038353437362c36333031343734302c31303235313538332c3133333932393831362c31313732363932355d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a37377d"
last_updated: 2026-08-03
---

# Add or Edit a Stammdaten/DM View Component

## Context
`TypView`, `ZauberView`, `FertigkeitView` (`app/components/stammdaten/*View.vue`) and `WesenView` (`app/components/dm/WesenView.vue`) all follow one shape: a read-only fact display with a pencil-icon button that toggles into a `FUDataEdit` form, calling `props.onSave(data)` on submit. Each is used in **two** contexts — a detail page (passes a real `onSave` that persists via [`useStammEdit().saveStammDocument()`](mex://function:31f5ae8475ef02364005bc94408fb933)) and a list's quick-view `UPopover` (e.g. `ZauberList.vue`'s "preview" column), which never passes `onSave` at all.

## Steps
1. Declare `onSave` as optional, not required:
```ts
onSave: {
  type: Function as PropType<(data: Partial<T>) => Promise<void> | void>,
  default: undefined   // NOT required: true
}
```
2. Gate the edit-toggle button on its presence:
```html
<UButton v-if="onSave" ... @click="toggleEditMode" />
```
3. Call it with optional chaining in the save handler:
```ts
async function handleSave(data) {
  await props.onSave?.(data)
  editMode.value = false
}
```
4. On the detail page (the context that persists changes), pass a real handler backed by [`useStammEdit()`](mex://function:f86dca787a37112a1964b48e84c0081f):
```ts
const { saveStammDocument } = useStammEdit()
// onSave={(data) => saveStammDocument('zauber', data)}
```

## Gotchas
- Skipping step 1 or 2 — a required `onSave` with an unguarded edit button — lets the list-preview popover render a working-looking edit button that throws `onSave is not a function` the moment someone clicks save in a context where nothing was ever passed. This exact bug was found and fixed in `TypView`/`ZauberView`/`FertigkeitView` on 2026-07-31; `WesenView` was the one that already did it correctly — use it as the reference if in doubt.
- `useStammEdit`/`useStammSchemas` live under `composables/stamm/` — a nested folder, so any new call site needs an explicit import (see `patterns/debug-composable-gotchas.md`).

## Verify
- [ ] `onSave` prop has `default: undefined`, not `required: true`
- [ ] The edit-toggle button has a `v-if="onSave"` guard (or equivalent)
- [ ] `handleSave` (or equivalent) calls `props.onSave?.(...)`, not `props.onSave(...)` directly
- [ ] The component renders correctly with no `onSave` passed (list preview) and with a real one passed (detail page) — check both, not just one
- [ ] `pnpm typecheck` passes

## Update Scaffold
- [ ] If a new component joins this family (used both as a preview and an editable detail view), note it in `context/conventions.md`'s pattern #2
