/**
 * Polyfill function that tells whether a given element matches a selector.
 * @param {!Element} el Element
 * @param {!string} selector Selector to look for
 * @return {!boolean} Whether the element matches the selector
 */
const matchesSelectorCompat = (el, selector) => {
  if (el.matches) {
    return el.matches(selector)
  }
  if (el.matchesSelector) {
    return el.matchesSelector(selector)
  }
  if (el.webkitMatchesSelector) {
    return el.webkitMatchesSelector(selector)
  }
  return false
}

/**
 * Returns closest ancestor of element which matches selector.
 * Similar to 'closest' methods as seen here:
 *  https://api.jquery.com/closest/
 *  https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
 * @param  {!Element} el        Element
 * @param  {!string} selector   Selector to look for in ancestors of 'el'
 * @return {?HTMLElement}       Closest ancestor of 'el' matching 'selector'
 */
const findClosestAncestor = (el, selector) => {
  let parentElement
  for (parentElement = el.parentElement;
    parentElement && !matchesSelectorCompat(parentElement, selector);
    parentElement = parentElement.parentElement) {
    // Intentionally empty.
  }
  return parentElement
}

/**
 * Determines if element has a table ancestor.
 * @param  {!Element}  el   Element
 * @return {boolean}        Whether table ancestor of 'el' is found
 */
const isNestedInTable = el => Boolean(findClosestAncestor(el, 'table'))

/**
 * Copy attributes from source to destination as data-* attributes.
 * @param {!HTMLElement} source
 * @param {!HTMLElement} destination
 * @param {!string[]} attributes
 * @return {void}
 */
const copyAttributesToDataAttributes = (source, destination, attributes) => {
  for (const attribute of attributes) {
    if (source.hasAttribute(attribute)) {
      destination.setAttribute(`data-${attribute}`, source.getAttribute(attribute))
    }
  }
}

/**
 * Copy data-* attributes from source to destination as attributes.
 * @param {!HTMLElement} source
 * @param {!HTMLElement} destination
 * @param {!string[]} attributes
 * @return {void}
 */
const copyDataAttributesToAttributes = (source, destination, attributes) => {
  for (const attribute of attributes) {
    const dataAttribute = `data-${attribute}`
    if (source.hasAttribute(dataAttribute)) {
      destination.setAttribute(attribute, source.getAttribute(dataAttribute))
    }
  }
}

export default {
  matchesSelectorCompat,
  findClosestAncestor,
  isNestedInTable,
  copyAttributesToDataAttributes,
  copyDataAttributesToAttributes
}