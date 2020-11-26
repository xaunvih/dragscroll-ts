# 🙌😍✌️ DragScroll

A drag to scroll library. Supports smooth content scroll via mouse/touch dragging. Publish standard format Js such as commonJs, ES Modules, UMD, Typescript

### Installation

You can install it via `npm` or `yarn` package manager:

```bash
npm i @springjs/dragscroll
```

```bash
yarn add @springjs/dragscroll
```

### Usage

The most simple setup with default settings:

```js
// with script tag
<script type="type/javascript" src="./path/@springjs/dragscroll/build/dragscroll.min.js"></script>
```

```js
// common js
const DragScroll = require('@springjs/dragscroll)
```

```js
// es module
import '@springjs/dragscroll/buid/dragscroll.scss'
import DragScroll from '@springjs/dragscroll'
```

```js
const $container = document.getElementById('demo-wrapper')
new DragScroll({
    $container: $container,
    gapSide: 30,
    speed: 2,
})
```

```js
// Typescript
import DragScroll, { DragScrollOptions } from '@springjs/dragscroll'
```

### Config options

| Option      | Type    | Description                        |
| ----------- | ------- | ---------------------------------- |
| inputsFocus | boolean | Allow input fields to be focused   |
| hideScroll  | boolean | Default is hide browsers scrollbar |

### API

| Name       | Description                        |
| ---------- | ---------------------------------- |
| scrollTo() | Param is cordinate object { x, y } |

### Files size

| File                             | size    |
| -------------------------------- | ------- |
| dragscroll.cjs.js                | 5 KB    |
| dragscroll.es.js                 | 4.98 KB |
| dragscroll.min.js (included css) | 7.75 KB |

### Reference

-   Hide scrollwith with css:
    -   https://developer.mozilla.org/en-US/docs/Archive/Web/CSS/-ms-overflow-style
    -   https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar

### License

MIT License (c) 2020 XuanVinh
