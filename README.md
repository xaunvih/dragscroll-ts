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

### Usage

The most simple setup with default settings:

```js es2015
import DragScroll from '@springjs/dragscroll'

const $container = document.getElementById('demo-wrapper')
new DragScroll({
    $container: $container,
    gapSide: 30,
    speed: 2,
})
```

### License

MIT License (c) 2020 XuanVinh
