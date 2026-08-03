---
name: add-list-page
description: Add a new UTable-based list page (or a filterable multi-select column to an existing one), using this app's shared chrome and responsive-column conventions.
triggers:
  - "add a list page"
  - "add a table"
  - "new list"
  - "add a column"
  - "filterable column"
  - "multi-select filter"
edges:
  - target: context/conventions.md
    condition: for the full naming/structure/pattern rules referenced here
  - target: context/architecture.md
    condition: for how list pages fit into the request flow and shared-component layer
  - target: patterns/debug-composable-gotchas.md
    condition: if the new page silently does nothing (blank icon, blank header cell, blank column) with no lint/typecheck error
  - target: patterns/add-stammdaten-view.md
    condition: if the list also needs a read-only quick-view preview popover backed by a *View.vue component
grounds_to:
  - node: "function:54b86f5d03fc7d414f96708c8c778140"
    fingerprint: "mh:64:7b226d696e68617368223a5b33333830393232392c313037323836332c34373037303039302c383638393230362c34373830363431312c34383038393434382c32313833393931392c33333237303937352c36303232333137322c32373536353437312c393039393633342c31353638333739362c36323630333730392c33343438313634322c31333137393237352c33343534313332322c34323138313935332c31303836333439392c35363635323237362c31373936343939352c34363936393430372c3237383732323730322c34353831393735362c333130313835352c33353934353230322c36353536363832362c31323438323130372c32333239363630332c39333039313239342c333038333636392c3334303730302c31333237353231322c32373733383333372c34303134313533302c31343237343234332c313934333631382c32333831333630342c37323731343436362c32343839343034332c3134343833343039302c343031343031302c34383535313237302c34383637353032322c32303939363230302c32333330343039302c393135353936312c32363434373235392c38323132323330352c34363733343737312c32323332343235392c33313938383132302c35393339363137322c33373233303131322c35343535343034372c313432303235342c31343139343035362c3130353035363138372c35373435323234332c31333235333739312c32353238323431322c3131383733353536302c34323533363230352c373132303139352c37343032303038315d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a3134307d"
  - node: "function:c5e0b9a8a07f34c139897de98d4fcb61"
    fingerprint: "mh:64:7b226d696e68617368223a5b34373339313337332c37383331353439302c3137333535383237392c3130383538333939332c34373830363431312c35373037323531342c38313233343739372c32323031373238352c36303232333137322c32373536353437312c393039393633342c31353638333739362c38303333313031332c31323339333032382c31363131323538342c33343534313332322c35393933363033362c38333737343338342c3133313735363438362c32313230343638382c35323331333632372c33373936353239362c31313638353438382c323332333037352c31363232383835372c3132363234343537372c323034383432372c32333930353139302c32373731313939332c36303238353337372c33353037393031312c3130303636323732362c32373733383333372c31313431373433332c37313637303431332c313934333631382c32333831333630342c31333730383630332c32343839343034332c38303037393235302c3136323133313733302c35363334363935382c34383637353032322c32303939363230302c32353134353335302c393232333838372c39363132323030392c363435343633362c31373131383338312c3132303632313938342c33313938383132302c35393339363137322c3131303034363134362c36303334393839322c32383433303136362c31343139343035362c32313032363930362c34343830343438372c33343339363034372c32353238323431362c32363235333133302c32343034353139312c32323333383536342c31313732363932355d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a3132387d"
  - node: "function:36438aad1fcd886cdac7b41f2951f47b"
    fingerprint: "mh:64:7b226d696e68617368223a5b3136343536333038302c3134323037373935372c34373037303039302c3230393939373631332c34373830363431312c35373037323531342c3139323031373130362c3130333434373737352c36303232333137322c32373536353437312c393039393633342c3230333132353533332c3230353633383434342c32313034343836352c3136313530393532322c3331353038343833392c3135363939333132302c36383938303239312c3230363133383832302c3132373139343932322c3333303739313431362c3133373737373232352c3235393930343134362c33313332343535302c343935373133332c3331333033353830382c35303238343738362c32333930353139302c3132393938373839302c36303238353337372c32383736313331342c34353035343635382c32373733383333372c3134343331313935322c3338323930333831362c313934333631382c32333831333630342c35343439373334392c3131333638353436382c3133323233333533372c36353530383733302c3232323434343836352c3832363536312c3239313639373435362c39373531363434342c39333838383936352c3238333735333938302c3134353032313330352c34303434373932392c35373136363733392c38323531313430312c38353538393134392c3232333137333434342c3138393638373638322c38353336313636392c31343139343035362c34363934393831332c3536303838373339332c3239363332303833352c34323230353736322c31363935373433312c3133373938363137332c32333032383630312c34313330363839375d2c226e65696768626f7273223a5b5d2c22746f6b656e436f756e74223a34307d"
  - node: "function:1be3bb9b13e48dffa7920067c21af052"
    fingerprint: "mh:64:7b226d696e68617368223a5b323330393734352c383538333738352c32343039383533352c393435353339312c31353435343230392c32303338333833322c33353631313437352c31333530393139342c32313731343337332c333535343833302c31373931303839362c333136393035392c34313535363139362c32313034343836352c33303833323034332c32363730383537342c36313931303933352c353835303039302c34393131313036332c31343739333537382c31393038373338362c34313235313033332c313830393030342c33313332343535302c343935373133332c32303430393930312c3131353434303237322c31353137363432332c313235323230302c343238303730362c323633383732302c313133393637322c32373733383333372c32343236323838342c31343134333938332c313934333631382c32333831333630342c31303836393338392c31303032353038372c32323632323334382c333734383331382c35373637303735392c3832363536312c31303137373432342c353630353534392c353833383337312c39353839333131302c39383035343233352c373832383038302c32323332343235392c31313736393836382c35323736393035372c36313830323433382c31373433303131302c34313233323338302c31353033333735322c33323230373433352c32363531373633392c393736393036392c31303831393534332c32363136333833312c31353437353632392c32323333383536342c31313732363932355d2c226e65696768626f7273223a5b2266756e6374696f6e3a3463363862386664653737373064613639386236643430363734646531633262225d2c22746f6b656e436f756e74223a3239397d"
last_updated: 2026-08-03
---

# Add a List Page

## Context
Every existing list page (`AbenteurerList.vue`, `GruppenListe.vue`, `ProfilListe.vue`, `KampagnenListe.vue`, `ZauberList.vue`, `FertigkeitenList.vue`, `WesenList.vue`, the Typen index) follows the same shape: a domain composable fetches data through the entity's Pinia store, a `UTable` renders it with `AppPageHeader` above and `TableFooter` below, and column visibility narrows automatically on small screens via [`withResponsiveBreakpoints()`](mex://function:54b86f5d03fc7d414f96708c8c778140) / [`useResponsiveColumnVisibility()`](mex://function:c5e0b9a8a07f34c139897de98d4fcb61), both in `app/composables/useResponsiveColumns.ts`.

## Task: Add a new list page

### Steps
1. Confirm the entity has a Pinia store (`use*Store()` in `app/stores/`) and a domain composable in the right nested folder (`composables/stamm/`, `composables/dm/`, `composables/spieler/`, etc.) — read from the store at the component's top level, not inside another composable's function body (see the Gotchas below).
2. Build the `ColumnDef[]` array for `UTable`, then wrap it in `withResponsiveBreakpoints(columns)` before binding, and feed the same columns ref into `useResponsiveColumnVisibility(columns)` for `:column-visibility`. If the table has a leading unlabeled action column, give it `id: 'preview'` so the heuristic recognizes it as exempt (it and the following two labeled columns stay always-visible; everything after gets an auto-assigned `sm→2xl` tier).
3. Render the page's `#header` slot with `AppPageHeader` (`title`, `items` breadcrumb; `#center` for a search input + live count, `#right` for CSV/PDF export buttons and a "+ create" icon button that opens a `UModal`, not an inline form).
4. Render `TableFooter` below the `UTable`, passing `tableApi` (the TanStack `Table` instance) — pass `resettable={false}` only if the table genuinely has no per-column filters.
5. If quick preview without navigating to a detail page is wanted, add a `preview` column with a `UPopover` rendering the entity's `*View.vue` component with no `onSave` passed (see `patterns/add-stammdaten-view.md`).

## Task: Add a filterable multi-select column

### Steps
1. Derive the option list with [`uniqueValues(data, f)`](mex://function:391e647f63bea8b42d0cbf2d741a1c45) from `app/composables/useArrayFunctions.ts`) — it already filters out falsy/empty-string values, which Nuxt UI's `USelectMenu`/`SelectItem` will otherwise crash on.
2. Build the header with [`multiSelectableHeader(label, items, options)`](mex://function:1be3bb9b13e48dffa7920067c21af052) from `app/composables/useTableColumnHeader.ts`, passing a `toValue` transform (e.g. `Number`) only if the column is numeric.
3. Set the column's `filterFn` to [`multiSelectFilter`](mex://function:36438aad1fcd886cdac7b41f2951f47b) — never TanStack's built-in `'arrIncludesSome'`.

### Gotchas
- **Never call a `@pinia/colada`-backed `use*Store()` from inside another composable's function body** (e.g. from within a `computed()` getter) — only from a component's top level. Doing otherwise re-registers a new query subscription on every re-evaluation, producing a repeating "onMounted/onServerPrefetch/onUnmounted called when there is no active component instance" console warning and hanging the page (no thrown error — looks like a slow/frozen load, not a crash). Fix: pass the already-instantiated function in as a parameter instead of re-deriving it inside the nested composable.
- **`'arrIncludesSome'` is wrong for a scalar column** — it assumes the row's value is array-like. It silently does substring matching on strings and throws `TypeError: ... .includes is not a function` on numeric columns. Always use `multiSelectFilter` instead.
- **`USelectMenu`'s `modelValue` must stay in the same domain as `items`' `value` field**, not the post-`toValue`-transformed stored filter value — reverse-match stored values against `items()` to recover what the widget expects, or selecting an already-selected item won't toggle it off.
- **Column order changes what stays "always visible."** Reordering the first few columns in a `*List.vue` changes which ones the responsive heuristic treats as load-bearing.
- Adding a new nested composable file needs an explicit import at every call site — see `patterns/debug-composable-gotchas.md`.

### Verify
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] New page renders correctly on a hard reload/direct nav if it's behind `/secured/**` (not just a client-side link click)
- [ ] Resizing the browser narrower hides columns in the expected tier order, and the always-visible columns (preview + first two labeled) never disappear
- [ ] A multi-select filter column toggles selections on and off correctly (not just adds duplicates)

### Debug
If a new icon, header widget, or column renders blank with zero lint/typecheck errors, see `patterns/debug-composable-gotchas.md`.

## Update Scaffold
- [ ] Update `.mex/ROUTER.md` "Current Project State" if a new route group or major list page went live
- [ ] Update `context/architecture.md` if the new page introduces a new domain/store, not just another instance of an existing pattern
