import { addEventListener, getActiveText, getCopyText, getLineText, getSelection, nextTick, setCopyText, createExtension } from '@vscode-use/utils'
import { trim } from 'lazy-js-utils'

let timer: any = null


export const { activate, deactivate } = createExtension(() => {
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
    if (!selection)
      return
    const lineText = getLineText(selection.line)
    if (lineText) {
      const trimLineText = trim(lineText, 'post')
      if (trimLineText === trimEndCopyText)
        return isWorking = false
    }
    if (trimEndCopyText === copyText)
      return isWorking = false
    const code = getActiveText()
    const needNewline = code ? code.includes(copyText) : false
    setCopyText(needNewline ? `${trimEndCopyText}\n` : trimEndCopyText).then(() => isWorking = false)
  }, 800)
  addEventListener('activeText-change', () => {
    isWorking = false
    clearInterval(timer)
    nextTick(run)
  })

  run()
}, () => {
  clearInterval(timer)

})
