import { getCopyText, setCopyText } from '@vscode-use/utils'
import { trim } from 'lazy-js-utils'

let timer: any = null
export async function activate() {
  timer = setInterval(async () => {
    const copyText = await getCopyText()
    const trimEndCopyText = trim(copyText, 'post')
    if (trimEndCopyText === copyText)
      return
    setCopyText(trimEndCopyText)
  }, 60)
}

export function deactivate() {
  clearInterval(timer)
}
