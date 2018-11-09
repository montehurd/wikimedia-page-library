import './EditTransform.css'

const CLASS = {
  SECTION_HEADER: 'pagelib_edit_section_header',
  TITLE: 'pagelib_edit_section_title',
  LINK_CONTAINER: 'pagelib_edit_section_link_container',
  LINK: 'pagelib_edit_section_link',
  PROTECTION: { UNPROTECTED: '', PROTECTED: 'page-protected', FORBIDDEN: 'no-editing' }
}

const IDS = {
  TITLE_DESCRIPTION: 'pagelib_edit_section_title_description',
  ADD_TITLE_DESCRIPTION: 'pagelib_edit_section_add_title_description',
  DIVIDER: 'pagelib_edit_section_divider'
}

const DATA_ATTRIBUTE = { SECTION_INDEX: 'data-id', ACTION: 'data-action' }
const ACTION_EDIT_SECTION = 'edit_section'

/**
 * @param {!Document} document
 * @param {!number} index The zero-based index of the section.
 * @return {!HTMLAnchorElement}
 */
const newEditSectionLink = (document, index) => {
  const link = document.createElement('a')
  link.href = ''
  link.setAttribute(DATA_ATTRIBUTE.SECTION_INDEX, index)
  link.setAttribute(DATA_ATTRIBUTE.ACTION, ACTION_EDIT_SECTION)
  link.classList.add(CLASS.LINK)
  return link
}

/**
 * @param {!Document} document
 * @param {!number} index The zero-based index of the section.
 * @return {!HTMLSpanElement}
 */
const newEditSectionButton = (document, index) => {
  const container = document.createElement('span')
  container.classList.add(CLASS.LINK_CONTAINER)

  const link = newEditSectionLink(document, index)
  container.appendChild(link)

  return container
}

/**
 * As a client, you may wish to set the ID attribute.
 * @param {!Document} document
 * @param {!number} index The zero-based index of the section.
 * @param {!number} level The *one-based* header or table of contents level.
 * @param {?string} titleHTML Title of this section header.
 * @param {?boolean} showEditPencil Whether to show the "edit" pencil (default is true).
 * @return {!HTMLElement}
 */
const newEditSectionHeader = (document, index, level, titleHTML, showEditPencil = true) => {
  const element = document.createElement('div')
  element.className = CLASS.SECTION_HEADER

  const title = document.createElement(`h${level}`)
  title.innerHTML = titleHTML || ''
  title.className = CLASS.TITLE
  title.setAttribute(DATA_ATTRIBUTE.SECTION_INDEX, index)
  element.appendChild(title)

  if (showEditPencil) {
    const button = newEditSectionButton(document, index)
    element.appendChild(button)
  }

  return element
}

class TitleDescription {
  constructor(document, titleDescription, additionString, isEditable) {
    this.document = document
    this.titleDescription = titleDescription
    this.additionString = additionString
    this.isEditable = isEditable
  }
  elements() {
    const p = this.document.createElement('p')
    p.id = IDS.TITLE_DESCRIPTION
    p.innerHTML = this.titleDescription
    return p
  }
  additionElements() {
    const a = this.document.createElement('a')
    a.href = '#'
    a.setAttribute('data-action', 'add_title_description')
    const p = this.document.createElement('p')
    p.id = IDS.ADD_TITLE_DESCRIPTION
    p.innerHTML = this.additionString
    a.appendChild(p)
    return a
  }
  titleDescriptionExists() {
    return this.titleDescription !== undefined && this.titleDescription.length > 0
  }
  elementsToShow() {
    if (!this.isEditable || this.titleDescriptionExists()) {
      return this.elements()
    }
    return this.additionElements()
  }
}

const newEditLeadSectionHeader = (document, articleDisplayTitle, titleDescription, 
  addTitleDescriptionString, isTitleDescriptionEditable, showEditPencil = true) => {

  const container = document.createElement('div')

  container.appendChild(newEditSectionHeader(document, 0, 1, articleDisplayTitle, showEditPencil))

  const titleDescriptionObj = new TitleDescription(document, titleDescription, addTitleDescriptionString,
    isTitleDescriptionEditable)

  const titleDescriptionElements = titleDescriptionObj.elementsToShow()
  if (titleDescriptionElements) {
    container.appendChild(titleDescriptionElements)
  }

  const divider = document.createElement('hr')
  divider.id = IDS.DIVIDER
  container.appendChild(divider)

  return container
}

export default {
  CLASS,
  newEditSectionButton,
  newEditSectionHeader,
  newEditLeadSectionHeader
}