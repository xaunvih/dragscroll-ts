export function hasTextSelectFromPoint($ele: HTMLElement, x: number, y: number): boolean {
    const nodes = $ele.childNodes
    const range = document.createRange()

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node.nodeType !== 3) {
            continue
        }

        range.selectNodeContents(node)
        const rect = range.getBoundingClientRect()
        if (x >= rect.left && y >= rect.top && x <= rect.right && y <= rect.bottom) {
            return true
        }
    }

    return false
}
