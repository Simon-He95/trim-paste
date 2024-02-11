import { addEventListener, createRange, getCopyText, getLineText, getPosition, updateText } from '@vscode-use/utils'
import type { Disposable, ExtensionContext } from 'vscode'
import { trim } from 'lazy-js-utils'

// bug: 修复回车的时候也会触发，将换行给取消的问题
export async function activate(context: ExtensionContext) {
  const disposes: Disposable[] = []

  disposes.push(addEventListener('text-change', async ({ contentChanges }) => {
    if (contentChanges.length === 1) {
      const change = contentChanges[0]
      const text = change.text
      let lineText: string = ''
      try {
        lineText = getLineText(change.range.start.line)?.trim() || ''
      }
      catch (error) {

      }
      if (!text.trim() || text.trim() === lineText)
        return
      const range = change.range
      const copyText = await getCopyText()
      if (copyText === text) {
        const trimedText = trim(text, 'post')
        if (trimedText === text)
          return
        const endPosition = getPosition(change.rangeOffset + text.length)
        const textRange = createRange(range.start.line, range.start.character, endPosition.line, endPosition.character)
        updateText((edit) => {
          edit.replace(textRange, trimedText)
        })
      }
    }
  }))

  context.subscriptions.push(...disposes)
}

export function deactivate() {

}
