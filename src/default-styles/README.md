# Default Style CSS

This CSS file provides a default style setup for your web project. It includes a rem setup, CSS variables for spacing, and a color scheme.

There are 3 ways to use this content.
- Use it from CDN (We don't have CDN yet! But stay tuned)
- Copy the content of the files and paste it in your project.
- Clone/Download the repo and use it in your project. 
	- Add it with `<link rel="stylesheet" href="/path/to/default-styles/reset.css" />` in your html file. or
	- If you are worried about seperate files, then use a bundler and let it take care of it. 

## Documentation for `reset.css`

The `reset.css` file is used to reset the default styles that are applied by the browser. This helps to ensure that your website looks consistent across different browsers.

It does the following things:

-   resets the default margin and padding applied to some of the elements.
-   resets underline for `a`
-   resets borders on `img` element
-   resets decoration on `ul` and `li`
-   resets defaults on `button`, `input`, `optgroup`, `select`, and `textarea`

## Documentation for `rem.css`

This CSS file, `rem.css`, is primarily used for setting up font sizes and spaces in your application using the `rem` unit. The `rem` unit is relative to the root—or the html—element. That means that we can define a single font size on the root element, and define all `rem` units to be a percentage of that.

It has the following features:

-   Default base font-size is set at `16px`.
-   Provides css variables for font sizes from `h1`, `h2`, `h3`, `h4`, `h5`, `h6` and `p`. Use it with `--font-size-{h1/h2/h3/h4/h5/h6/p}`. Additionally this is applied to relavent element also.
-   Provides css variables for spaces in `xs`, `sm`, `md`, `lg` and `xl`. Use it with `--space-{xs/sm/md/lg/xl}`

### Usage Examples

```html
<!-- dont need any additional classes -->
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>
<p>Paragraph</p>

<!-- use the css variables for font sizes -->
<span style="font-size: var(--font-size-h3)">Content</span>
```

```html
<div style="margin: var(--space-md) 0">
	<!-- Content goes here -->
</div>
```

```html
<div style="padding: var(--space-md) 0">
	<!-- Content goes here -->
</div>
```

```html
<div style="display: flex; gap: var(--space-md)">
	<!-- Content goes here -->
</div>
```

## Documentation for `flex-box.css`

This CSS file contains classes for managing flexbox layouts.

-   **Flex Container**: The `.flex` class applies a flex display to an element, turning it into a flex container.

### Usage Examples

```html
<div class="flex">
	<!-- Flex items go here -->
</div>
```

-   **Flex Direction**: The `.f-row`, `.f-row-reverse`, `.f-column`, and `.f-column-reverse` classes set the direction of the flex items in the container.

### Usage Examples

```html
<div class="flex f-row">
	<!-- Flex items go here -->
</div>
```

-   **Flex Wrap**: The `.f-wrap`, `.f-nowrap`, and `.f-wrap-reverse` classes control whether the flex items wrap onto multiple lines and in what order.

### Usage Examples

```html
<div class="flex f-row f-wrap">
	<!-- Flex items go here -->
</div>
```

-   **Justify Content**: The `.jc-start`, `.jc-end`, and `.jc-center` classes align the flex items along the main axis of the container.

### Usage Examples

```html
<div class="flex f-row jc-start">
	<!-- Flex items go here -->
</div>
```

-   **Align Items**: The `.ai-start`, `.ai-end`, `.ai-center`, `.ai-baseline`, and `.ai-stretch` classes align the flex items along the cross axis of the container.

### Usage Examples

```html
<div class="flex f-row jc-space-between ai-center">
	<!-- Flex items go here -->
</div>
```

-   **Align Content**: The `.ac-start`, `.ac-end`, `.ac-center`. `.ac-space-between`, `.ac-space-around`, and `.ac-stretch` classes align the flex lines along the cross axis of the container.

### Usage Examples

```html
<div class="flex f-row jc-space-between ai-center">
	<div class="ac-center"></div>
	<div class="ac-stretch"></div>
</div>
```

-   **Flex Grow**: The `.f-grow-0` and `.f-grow-1`. The `.f-grow-0` class sets the flex grow factor to 0. The `.f-grow-1` class sets the flex grow factor to 1.

### Usage Examples

```html
<div class="flex f-row jc-space-between ai-center">
	<!-- Flex items go here -->
	<div class="f-grow-1"></div> <!-- This item will take up the remaining space -->
	<div></div>
</div>
```

-   **Flex Basis**: The `.f-basis-auto`, `.f-basis-0`, `.f-basis-100`, `.f-basis-50`, `.f-basis-25`, `.f-basis-75`, `.f-basis-33`, `.f-basis-66`. The `.f-basis-auto` class sets the initial main size of a flex item to its fit-content size. The `.f-basis-0` class sets the initial main size of a flex item to 0. The `.f-basis-100` class sets the initial main size of a flex item to 100%. The `.f-basis-50` class sets the initial main size of a flex item to 50%. The `.f-basis-25` class sets the initial main size of a flex item to 25%. The `.f-basis-75` class sets the initial main size of a flex item to 75%. The `.f-basis-33` class sets the initial main size of a flex item to 33%. The `.f-basis-66` class sets the initial main size of a flex item to 66%.

### Usage Examples

```html
<div class="flex f-row jc-space-between ai-center">
	<!-- Flex items go here -->
	<div class="f-basis-50"></div> <!-- This item will take up 50% of the space -->
	<div></div>
</div>
```

- **Flex Item**: The `.f-item`, `.f-item-auto`, `.f-item-none`. The `.f-item` class sets the flex item to be a flex item. The `.f-item-auto` class sets the flex item to be a flex item with auto margins. The `.f-item-none` class sets the flex item to be a flex item with no size.

### Usage Examples

```html
<div class="flex f-row jc-space-between ai-center">
	<!-- Flex items go here -->
	<div class="f-item-auto"></div> <!-- This item will take up the remaining space -->
	<div></div>
</div>
```

## Documentation for `colors.css `

This css file contains styles for color and themes.

Has 6 color sets: `primary`, `accent`, `normal`, `success`, `warning`, `danger`.

Each color set has 7 shades: `100`, `200`, `300`, `400`, `500`, `600`, `700`.

We recommend to make the color pallete yourself as per your requirement. But this will help to start.

### Usage Examples

```html
<div style="background-color: var(--primary-100)">
	<!-- Content goes here -->
</div>
```

```html
<div style="color: var(--primary-100)">
	<!-- Content goes here -->
</div>
```

```html
<div style="border: 1px solid var(--primary-100)">
	<!-- Content goes here -->
</div>
```

```html
<div style="box-shadow: 0 0 10px var(--primary-100)">
	<!-- Content goes here -->
</div>
```