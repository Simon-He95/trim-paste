import { getCopyText, getLineText, getSelection, setCopyText } from '@vscode-use/utils'
import { trim } from 'lazy-js-utils'

let timer: any = null
export async function activate() {
  timer = setInterval(async () => {
    const copyText = await getCopyText()
    const trimEndCopyText = trim(copyText, 'post')
    // 如果是纯空格则不处理
    if (!trimEndCopyText)
      return
    const selection = getSelection()
    if (selection) {
      const lineText = getLineText(selection.line)
      if (lineText === trimEndCopyText)
        return
    }
    if (trimEndCopyText === copyText)
      return
    setCopyText(trimEndCopyText)
  }, 60)
}

export function deactivate() {
  clearInterval(timer)
}
