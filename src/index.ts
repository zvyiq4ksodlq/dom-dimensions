export type Spacer = 'margin' | 'padding'
export type Direction =
  'top' | 'right' | 'bottom' | 'left'

function measureGap(
  el: HTMLElement,
  spacer: Spacer,
  directions: Direction[]
): number {
  const style = getComputedStyle(el);
  const gap =
    parseFloat(style.getPropertyValue(`${spacer}-${directions[0]}`)) +
    parseFloat(style.getPropertyValue(`${spacer}-${directions[1]}`));
  return gap;
}

/**
 * Measures the width of an element along the outer
 * edge. By default, will include both left and right
 * margins, but this is optional.
 *
 * Should work on IE9+
 */
export function outerWidth(el: HTMLElement, includeMargin = true): number {
  const width = el.getBoundingClientRect().width;
  if (!includeMargin) return width;
  const marginX = measureGap(el, 'margin', ['left', 'right']);
  return width + marginX;
}

/**
 * Measures the height of an element along the outer
 * edge. By default, will include both top and bottom
 * margins, but this is optional.
 *
 * Should work on IE9+
 */
export function outerHeight(el: HTMLElement, includeMargin = true): number {
  const height = el.getBoundingClientRect().height;
  if (!includeMargin) return height;
  const marginY = measureGap(el, 'margin', ['top', 'bottom']);
  return height + marginY;
}

/**
 * Measures the width and height of the inner edge
 * of an element. By default, will subtract the element's
 * current padding, but this is optional.
 * @returns A tuple as [width, height]
 */
export function innerDimensions(
  el: HTMLElement,
  usePadding = true,
): [number, number] {
  const rect = el.getBoundingClientRect();
  if (!usePadding) return [rect.width, rect.height];
  const paddingX = measureGap(el, 'padding', ['left', 'right']);
  const paddingY = measureGap(el, 'padding', ['top', 'bottom']);
  return [rect.width - paddingX, rect.height - paddingY];
}

/**
 * Optimized version of innerDimensions, to use
 * if you only need the width of an element
 */
export function innerWidth(el: HTMLElement, usePadding = true): number {
  const width = el.getBoundingClientRect().width;
  if (!usePadding) return width;
  const padding = measureGap(el, 'padding', ['left', 'right']);
  return width - padding;
}

/**
 * Optimized version of innerDimensions, to use
 * if you only need the height of an element
 */
export function innerHeight(el: HTMLElement, usePadding = true): number {
  const height = el.getBoundingClientRect().height;
  if (!usePadding) return height;
  const padding = measureGap(el, 'padding', ['top', 'bottom']);
  return height - padding;
}

/**
 * Gets the equivalent pixel dimension according to the browser
 * for any CSS unit of dimension allowed by CSS. Adds
 * a temporary element to the DOM with the specified
 * style and then measures the pixel length. This
 * way you can accurately convert, say, mm to px.
 * @returns A tuple as [width, height]
 * @example
 * // returns [4, 38]
 * cssDimensionsToPx('1mm', '10mm')
 */
export function cssDimensionsToPx(
  width: string,
  height: string,
): [number, number] {
  // create a fake div of requested width/height
  const div = document.createElement('div');
  div.style.width = width;
  div.style.height = height;
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.padding = '0';
  div.style.margin = '0';
  div.style.top = '0';
  div.style.left = '0';
  div.style.boxSizing = 'content-box';

  // add it to the DOM
  document.body.appendChild(div);

  // measure it in pixels
  const rect = div.getBoundingClientRect();

  // remove it from the DOM
  document.body.removeChild(div);

  return [rect.width, rect.height];
}
