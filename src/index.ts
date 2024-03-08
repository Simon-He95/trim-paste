import { addEventListener, getCopyText, getLineText, getSelection, nextTick, setCopyText } from '@vscode-use/utils'
import { trim } from 'lazy-js-utils'

let timer: any = null
export async function activate() {
  let isWorking = false
  const run = () => timer = setInterval(async () => {
    if (isWorking)
      return
    isWorking = true
    const copyText = await getCopyText()
    if (!copyText)
      return isWorking = false
    const trimEndCopyText = trim(copyText, 'post')
    // 如果是纯空格则不处理
    if (!trimEndCopyText)
      return isWorking = false
    const selection = getSelection()
    if (selection) {
      const lineText = getLineText(selection.line)
      if (lineText) {
        const trimLineText = trim(lineText, 'post')
        if (trimLineText === trimEndCopyText)
          return isWorking = false
      }
    }
    if (trimEndCopyText === copyText)
      return isWorking = false
    setCopyText(trimEndCopyText).then(() => isWorking = false)
  }, 800)
  addEventListener('activeText-change', () => {
    isWorking = false
    clearInterval(timer)
    nextTick(run)
  })

  run()
}

export function deactivate() {
  clearInterval(timer)
}
