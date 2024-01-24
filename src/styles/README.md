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
