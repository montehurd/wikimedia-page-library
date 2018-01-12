import Polyfill from './Polyfill'

/**
 * Determine if paragraph is the one we are interested in.
 * @param  {!HTMLParagraphElement}  paragraphElement
 * @return {boolean}
 */
const isParagraphGood = paragraphElement => {
  // Ignore coordinates. See 'enwiki > Bolton Field'
  if (paragraphElement.querySelector('[id="coordinates"]')) {
    return false
  }
  // Ensures the paragraph has at least a little text. Otherwise silly things like a empty P or P
  // which only contains a BR tag will get pulled up. See enwiki 'Hawaii', 'United States',
  // 'Academy (educational institution)', 'Lovászpatona'
  const minLength = 50
  const lengthExceedsMinLength = paragraphElement.textContent.length >= minLength
  return lengthExceedsMinLength
}

/**
 * Everything we want to move up (everything between `goodParagraphElement` and the next paragraph).
 * @param  {!HTMLParagraphElement} goodParagraphElement
 * @return {!Array.<Element>}
 */
const elementsToMove = goodParagraphElement => {
  let didHitP = false
  let didHitNextP = false
  const shouldElementMoveUp = element => { // eslint-disable-line require-jsdoc
    if (didHitP && element.tagName === 'P') {
      didHitNextP = true
    } else if (element.isEqualNode(goodParagraphElement)) {
      didHitP = true
    }
    return didHitP && !didHitNextP
  }
  return Array.from(goodParagraphElement.parentNode.childNodes).filter(shouldElementMoveUp)
}

/**
 * A light-weight fragment to hold everything we want to move up.
 * @param  {!Document} document
 * @param  {!HTMLParagraphElement} goodParagraphElement
 * @return {!DocumentFragment}
 */
const fragmentOfElementsToMove = (document, goodParagraphElement) => {
  const fragment = document.createDocumentFragment()
  // DocumentFragment's `appendChild` attaches the element to the fragment AND removes it from DOM.
  // eslint-disable-next-line require-jsdoc
  const moveElementToFragment = element => fragment.appendChild(element)
  elementsToMove(goodParagraphElement).forEach(moveElementToFragment)
  return fragment
}

/**
 * Locate first 'good' paragraph. We don't want paragraphs from somewhere in the middle of a table,
 * so only paragraphs which are direct children of `containerID` element are considered. 
 * @param  {!Document} document
 * @param  {!string} containerID ID of the section under examination.
 * @return {?HTMLParagraphElement}
 */
const getFirstGoodParagraph = (document, containerID) =>
  Polyfill.querySelectorAll(document, `#${containerID} > p`).find(isParagraphGood)

/**
 * Instead of moving the infobox down beneath the first P tag, move the first 'good' looking P tag
 * (and related elements) up. This ensures some text will appear above infoboxes, tables, images
 * etc. This method does not do a 'mainpage' check - do so before calling it.
 * @param  {!Document} document
 * @param  {!string} containerID ID of the section under examination.
 * @param  {?Element} afterElement Element after which paragraph will be moved. If not specified
 * paragraph will be move to top of `containerID` element.
 * @return {void}
 */
const moveFirstGoodParagraphUp = (document, containerID, afterElement) => {
  const firstGoodParagraph = getFirstGoodParagraph(document, containerID)
  if (!firstGoodParagraph) {
    return
  }
  const container = document.getElementById(containerID)
  const insertBeforeThisElement = !afterElement ? container.firstChild : afterElement.nextSibling
  const fragment = fragmentOfElementsToMove(document, firstGoodParagraph)
  // Attach the fragment just before `insertBeforeThisElement`. Conveniently, `insertBefore` on a
  // DocumentFragment inserts 'the children of the fragment, not the fragment itself.', so no
  // unnecessary container element is introduced.
  // https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
  container.insertBefore(fragment, insertBeforeThisElement)
}

export default {
  moveFirstGoodParagraphUp,
  test: {
    isParagraphGood,
    fragmentOfElementsToMove,
    getFirstGoodParagraph
  }
}