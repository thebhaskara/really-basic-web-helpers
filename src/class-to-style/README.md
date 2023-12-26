# Class to Style

This helper is like a poorman's version of tailwindcss. It parses through class names and generates css for it. It is not as powerful as tailwindcss, but it is a good starting point for small projects.

If this helps, please star the repo.

## Usage

The syntax for using it is `property|value|selector|media-query`.

Here, the `property` and `value` are required. The `selector` and `media-query` are optional.

### Property

The property is the css property that you want to apply. For example, `color`, `background-color`, `font-size`, `margin`, `padding`, etc.

```html
<div class="color|red">
	<!-- Content goes here -->
</div>
```

There are certian shorthands also available. For example, `m` for `margin`, `p` for `padding`, `bg` for `background-color`, etc.

```html
<div class="d|flex">
	<!-- display:flex -->
	<!-- Content goes here -->
</div>
```

Following is the full list of shorthands available:

| Shorthand | Property          |
| --------- | ----------------- |
| bg        | `background`      |
| d         | `display`         |
| fd        | `flex-direction`  |
| fw        | `flex-wrap`       |
| jc        | `justify-content` |
| ai        | `align-items`     |
| ac        | `align-content`   |
| as        | `align-self`      |
| fg        | `flex-grow`       |
| fb        | `flex-basis`      |
| fl        | `float`           |
| clr       | `clear`           |
| m         | `margin`          |
| mt        | `margin-top`      |
| mr        | `margin-right`    |
| mb        | `margin-bottom`   |
| ml        | `margin-left`     |
| p         | `padding`         |
| pt        | `padding-top`     |
| pr        | `padding-right`   |
| pb        | `padding-bottom`  |
| pl        | `padding-left`    |
| pos       | `position`        |
| t         | `top`             |
| r         | `right`           |
| b         | `bottom`          |
| l         | `left`            |
| z         | `z-index`         |
| br        | `border-radius`   |
| g         | `gap`             |
| fs        | `font-size`       |
| bs        | `box-shadow`      |
| ta        | `text-align`      |
| va        | `vertical-align`  |
| ls        | `letter-spacing`  |
| lh        | `line-height`     |
| ws        | `white-space`     |
| o         | `overflow`        |
| to        | `text-overflow`   |
| v         | `visibility`      |
| w         | `width`           |
| h         | `height`          |

I dont know if you realized it, but you can assign values to css properties too

```html
<div class="--hmm|--primary-100">
	<div class="d|flex jc|center color|--hmm">
		<!-- display:flex; justify-content:center -->
		<!-- Content goes here -->
	</div>
</div>
```

### Value

The value is the value of the property. For example, `red`, `1rem`, `10px`, `center`, `row`, `column`, etc.

```html
<div class="color|red">
	<!-- Content goes here -->
</div>
```

Value has an additional addon to recognize the css variables. If you want to use a css variable, then you can use the following syntax:

```html
<div class="color|--primary-100">
	<!-- Content goes here -->
</div>
```

BTW, the css property values can have spaces right?. and you cannot put spaces in class names. So, how do you do that? Well, you can use `_` instead of spaces. For example, `center` becomes `center`, `center center` becomes `center_center`, `center center center` becomes `center_center_center`, etc.

```html
<div class="d|flex jc|center_center">
	<!-- Content goes here -->
</div>
```

```html
<div class="d|flex bs|1px_1px_2px_#999999">
	<!-- box-shadow: 1px 1px 2px #999999 -->
	<!-- Content goes here -->
</div>
```

Oh yeah, you can also use hex values. Just prefix it with `#`.

Also, you can use rgb or hsl values. Just prefix it with `rgb(` and suffix it with `)`. Just make sure that spaces are not there or they are replced with `_`.

```html
<div class="d|flex bs|1px_1px_2px_rgb(153,153,153)">
	<!-- box-shadow: 1px 1px 2px rgb(153, 153, 153) -->
	<!-- Content goes here -->
</div>
```

### Selector

The selector is the selector class that you want to apply. For example, `&:hover`, `&:focus`, `&:has(a:active)`, `.card_&`, etc.

Here, `&` is replaced by the class name generated. And, `_` is replaced by a space (to use it in places where selector requires a space).

```html
<div class="color|red|&:hover">
	<!-- Content goes here -->
</div>
```

### Media Query

The media query is the media query that you want to apply. There is a pattern to it. You have to start with either screen or print. and then you have to seperate media query by `+`

For eg...

```html
<div class="color|red|&:hover|screen+min-width:600px">
	<!-- translates to @media only screen and (min-width:600px) -->
	<!-- Content goes here -->
</div>
```

you can do multiple conditions too

```html
<div class="color|red|&:hover|screen+min-width:600px+max-width:800px">
	<!-- translates to @media only screen and (min-width:600px) and (max-width:800px) -->
	<!-- Content goes here -->
</div>
```

BTW, you can use the shorthands for media queries too.

```html
<div class="color|red|&:hover|screen+min-xs+max-lg">
	<!-- translates to @media only screen and (min-width: 0px) and (max-width: 1199.98px) -->
	<!-- Content goes here -->
</div>
```

Following is the full list of shorthands available:

| Shorthand | Media Query              |
| --------- | ------------------------ |
| screen    | `only screen`            |
| print     | `only print`             |
| min-xs    | `(min-width: 0px)`       |
| min-sm    | `(min-width: 576px)`     |
| min-md    | `(min-width: 768px)`     |
| min-lg    | `(min-width: 992px)`     |
| min-xl    | `(min-width: 1200px)`    |
| min-xxl   | `(min-width: 1400px)`    |
| min-xxxl  | `(min-width: 1600px)`    |
| max-xs    | `(max-width: 575.98px)`  |
| max-sm    | `(max-width: 767.98px)`  |
| max-md    | `(max-width: 991.98px)`  |
| max-lg    | `(max-width: 1199.98px)` |
| max-xl    | `(max-width: 1399.98px)` |
| max-xxl   | `(max-width: 1599.98px)` |
| max-xxxl  | `(max-width: 1799.98px)` |

## Limitations

-   It does not work inside shadow dom right away. You'll have to call the `classToStyle` function manually from inside the shadowRoot.
-   `classToStyle` function is called with DOM mutation observer. So, it is not exactly very performant. It is called only when the DOM changes. So, if you are adding elements dynamically, then you'll have to call the `classToStyle` function manually.

## Recommended Usage

-   Please copy the code onto index.html if you can. Just to avoid delay in applying styles.
-   Add shorthands as necessary to the property list or the media query list as required.
