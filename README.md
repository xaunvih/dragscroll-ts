# 🎉 DragScroll library

Drag Scroll library - smooth content scroll via mouse/touch dragging. Publish standard format Js such as commonJs, ES Modules, UMD, Typescript

Give this library the ⭐️ if it's useful 😉

![Alt text](dragscroll.gif?raw=true)

## Why DragScroll ?

- More comfortable with physical UI, make consistency between different devices

## Usage

### First of all, you need to import this library:

```js
// Javascript tag
<script type="type/javascript" src="https://unpkg.com/dragscroll-ts@1.0.4/build/dragscroll.min.js"></script>
```

```sh
# npm or yarn

npm i --save dragscroll-ts
yarn add dragscroll-ts
```

```js
// Common Javascript
const DragScroll = require('dragscroll-ts')
```

```js
// ES6 Module Javascript
import DragScroll from 'dragscroll-ts'
```

```ts
// Typescript
import DragScroll, { IDragScrollOptions } from 'dragscroll-ts'
const options: IDragScrollOptions = {}

interface IDragScrollOptions {
  $container: HTMLElement
  $content: HTMLElement
  axis: string
  allowInputFocus?: boolean
  allowSelectText?: boolean
}
```

### Next step, init drag scroll instance

```diff
- NOTE: This library only wrap dragscroll logic on available HTML, It doesn't touch stylesheet 😉
- Need to be specific the HTML structure of $container, $content elements. See picture below
```

```js
const $container = document.getElementById('demo-wrapper')
const $content = document.getElementById('demo-content')

new DragScroll({
  $container: $container,
  $content: $content,
  axix: 'x',
  allowInputFocus: true,
  allowSelectText: false,
})
```

![Alt text](illustration.png?raw=true)

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

## Events

The evt parameter is either MouseEvent or TouchEvent

| Name      | Description                                      |
| --------- | ------------------------------------------------ |
| dragstart | To be fired when starting drag                   |
| dragging  | To be fired when dragging                        |
| dragend   | To be fired when dragging content meet end point |

```js
// Example:
const dragSroll = new DragScroll({})
function handler(evt) {}

dragSroll.on('dragstart', handler)
dragSroll.off('dragstart', handler)
```

## Files size

| File              | Format    | size    |
| ----------------- | --------- | ------- |
| dragscroll.min.js | UMD       | 7.6 KB  |
| dragscroll.cjs.js | Common Js | 6.96 KB |
| dragscroll.es.js  | ES Module | 6.95 KB |

### License

MIT License (c) 2020 XuanVinh
