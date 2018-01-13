import assert from 'assert'
// import domino from 'domino'
import fixtureIO from '../utilities/FixtureIO'
import pagelib from '../../build/wikimedia-page-library-transform'

const moveFirstGoodParagraphUp = pagelib.FirstParagraphRelocationTransform.moveFirstGoodParagraphUp
// const isParagraphGood = pagelib.FirstParagraphRelocationTransform.test.isParagraphGood
// const getElementsToMove = pagelib.FirstParagraphRelocationTransform.test.getElementsToMove
// const getFirstGoodParagraph =
//   pagelib.FirstParagraphRelocationTransform.test.getFirstGoodParagraph

// eslint-disable-next-line require-jsdoc
const getChildTagNames = element => Array.from(element.children).map(el => el.tagName)

describe('FirstParagraphRelocationTransform', () => {
  describe('moveFirstGoodParagraphUp()', () => {
    describe('unit tests', () => {
      describe('isParagraphGood()', () => {
        // TODO: add tests!
      })
      describe('getElementsToMove()', () => {
        // TODO: add tests!
      })
      describe('getFirstGoodParagraph()', () => {
        // TODO: add tests!
      })
    })
    describe('integration tests', () => {
      it('paragraph is relocated', () => {
        const document = fixtureIO.documentFromFixtureFile('FirstParagraphRelocation-Obama.html')
        const soughtP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
        // Before: [ 'HR', 'DIV', 'TABLE', 'P', 'P', 'P', 'P', 'DIV' ]
        moveFirstGoodParagraphUp(document, 'content_block_0', null)
        assert.deepEqual(
          getChildTagNames(document.getElementById('content_block_0')),
          [ 'P', 'HR', 'DIV', 'TABLE', 'P', 'P', 'P', 'DIV' ]
        )
        const movedP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
        assert.deepEqual(soughtP, movedP)
      })
      it('related UL elements are relocated', () => {
        const document = fixtureIO.documentFromFixtureFile('FirstParagraphRelocation-Planet.html')
        const soughtP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
        // Before: [ 'HR', 'DIV', 'TABLE', 'P', 'UL', 'P', 'P', 'P', 'P', 'P' ]
        moveFirstGoodParagraphUp(document, 'content_block_0', null)
        assert.deepEqual(
          getChildTagNames(document.getElementById('content_block_0')),
          [ 'P', 'UL', 'HR', 'DIV', 'TABLE', 'P', 'P', 'P', 'P', 'P' ]
        )
        const movedP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
        assert.deepEqual(soughtP, movedP)
      })
      it('coordinates ignored, 1st paragraph relocated', () => {
        const document = fixtureIO.documentFromFixtureFile('FirstParagraphRelocation-Sharya.html')
        const soughtP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
        // Before: [ 'HR', 'TABLE', 'P', 'P' ]
        moveFirstGoodParagraphUp(document, 'content_block_0', null)
        assert.deepEqual(
          getChildTagNames(document.getElementById('content_block_0')),
          [ 'P', 'HR', 'TABLE', 'P' ]
        )
        const movedP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
        assert.deepEqual(soughtP, movedP)
      })
      it('coordinates ignored, 2nd paragraph relocated', () => {
        const document = fixtureIO.documentFromFixtureFile('FirstParagraphRelocation-Bolton.html')
        const soughtP = document.querySelector('#content_block_0 > p:nth-of-type(2)')
        // Before: [ 'HR', 'P', 'TABLE', 'P', 'P', 'P' ]
        moveFirstGoodParagraphUp(document, 'content_block_0', null)
        assert.deepEqual(
          getChildTagNames(document.getElementById('content_block_0')),
          [ 'P', 'HR', 'P', 'TABLE', 'P', 'P' ]
        )
        const movedP = document.querySelector('#content_block_0 > p:nth-of-type(1)')
        assert.deepEqual(soughtP, movedP)
      })
    })
  })
})