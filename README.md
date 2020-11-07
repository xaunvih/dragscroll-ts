# DragScroll

A drag to scroll micro library. Supports smooth content scroll via mouse/touch dragging without dependencies.

### Installation

You can install it via `npm` or `yarn` package manager:

```bash
npm i @springjs/dragscroll
```

```bash
yarn add @springjs/dragscroll
```

### Dedault config

```js
{
    speed: 1.5,
    gapSide: 30,
    direction: 'ALL',
    scrollMode: 'TRANSFORM',
}
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

### Files size

File | size
------ | -----------
dragscroll.cjs.js | 6.17 KB
dragscroll.es.js | 6.15 KB
dragscroll.min.js (included css) | 9.39 KB

### License

MIT License (c) 2020 XuanVinh
