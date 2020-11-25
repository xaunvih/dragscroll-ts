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

### Config options

Option | Type | Description
------ | ----------- | --------------------------------------------
inputsFocus | boolean | Allow input fields to be focused
gapSide | number | White space in both side of list. It's only effect with horizontal scroll mode. Default is 30px
speed | number | The speed when dragging. Default is 2
onDragStart | func | func is called when users start drag content
onDragging | func | func is called when users are dragging content
onDragEnd | func | func is called when users stop dragging content
### API

Name | Description
------ | -----------
scrollTo() | Param is cordinate object { x, y }

### Files size

File | size
------ | -----------
dragscroll.cjs.js | 6.17 KB
dragscroll.es.js | 6.15 KB
dragscroll.min.js (included css) | 9.39 KB

### License

MIT License (c) 2020 XuanVinh
