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
<script type="application/javascript" src="./path/@springjs/dragscroll/build/dragscroll.min.js"></script>
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
// init instance

const $container = document.getElementById('demo-wrapper')
new DragScroll({
    $container: $container,
    gapSide: 30,
    speed: 2,
})
```

```js
// with typescript
import DragScroll, { DragScrollOptions } from '@springjs/dragscroll'
```

### Files size

![Alt text](./public/size.png?raw=true 'page')

### License

MIT License (c) 2020 XuanVinh
