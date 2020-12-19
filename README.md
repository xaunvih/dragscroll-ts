# 🎉 DragScroll library

Drag Scroll library - smooth content scroll via mouse/touch dragging. Publish standard format Js such as commonJs, ES Modules, UMD, Typescript

## Usage 

### First of all, you need to import this library:

```js
// Javascript tag
<script type="type/javascript" src="dragscroll.min.js"></script>
```

```js
// Common Javascript
const DragScroll = require('@springjs/dragscroll)
```

```js
// ES6 Module Javascript
import DragScroll from '@springjs/dragscroll'
```

```js
// Typescript
interface IDragScrollOptions {
    $container: HTMLElement
    $content: HTMLElement
    axis: string
    allowInputFocus?: boolean
    allowSelectText?: boolean
}

import DragScroll from '@springjs/dragscroll/src/index.ts'
```

### Next step, init drag scroll instance

```js
const $container = document.getElementById('demo-wrapper')
const $content = document.getElementById('demo-content')

new DragScroll({
    $container: $container,
    $content: $content,
    axix: 'x',
    allowInputFocus: true
    allowSelectText: false
})
```

## Config options

| Option          | Type        | Description                                       |
| --------------- | ----------- | ------------------------------------------------- |
| \$container     | HTMLElement | The element wrap the dragable element             |
| \$content       | HTMLElement | The dragable child element of \$container.        |
| axis            | string      | Default is 'x'. There are 3 values: 'x', 'y','xy' |
|                 |             | 'x' is horizontal direction                       |
|                 |             | 'y' is vertical direction                         |
|                 |             | 'xy' is both direction                            |
| allowInputFocus | boolean     | Allow input fields can be focused                 |
| allowSelectText | boolean     | Allow text content can be selected                |

## API

| Name                 | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| scrollTo             | Pass coordinate object { x, y } to scroll to target position |
| setInputCanBeFocused | Default is true. Input fields can be focused                 |
| setTextCanBeSelected | Default is true. Text content can be selected                |
| destroy              | Remove all listeners                                         |

## Files size

| File              | size     |
| ----------------- | -------- |
| dragscroll.min.js | 7.53 KB  |
| dragscroll.cjs.js | 13.23 KB |
| dragscroll.es.js  | 13.22 KB |

### License

MIT License (c) 2020 XuanVinh
