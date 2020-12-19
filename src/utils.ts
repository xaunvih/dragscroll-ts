export function hasTextSelectFromPoint(evt: MouseEvent): boolean {
    const $ele = <HTMLInputElement>evt.target
    const nodes = $ele.childNodes
    const range = document.createRange()
    const { clientX, clientY } = evt

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node.nodeType !== 3) {
            continue
        }

        range.selectNodeContents(node)
        const rect = range.getBoundingClientRect()
        if (clientX >= rect.left && clientY >= rect.top && clientX <= rect.right && clientY <= rect.bottom) {
            return true
        }
    }

    return false
}
