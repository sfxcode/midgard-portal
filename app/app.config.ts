export default defineAppConfig({
  ui: {
    colors: {
      primary: 'gold',
      neutral: 'parchment',
      success: 'moss',
      error: 'crimson'
    },
    card: {
      slots: {
        root: 'rpg-frame'
      }
    },
    table: {
      slots: {
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-1.5 text-xs first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'py-2 border-b border-default'
      }
    }
  }
})
