/// <reference types="cypress" />

import v from './debian.json'
import { sendMessage } from '../request'

const token = Cypress.env('TELEGRAM_TOKEN') || ''
const chat_id = Cypress.env('TELEGRAM_CHAT_ID') || ''

describe(`Debian ${v.version}`, () => {
    beforeEach(() => {
        cy.visit(v.release_page)
    })

    it(`check for latest ${v.version}`, () => {
        expect(token, 'telegram \'token\' is not provided').not.to.be.null
        expect(chat_id, 'telegram \'chat_id\' is not provided').not.to.be.null

        const filter_text = `Updated Debian ${v.version}:`
        const $link = cy
            .get(`#content > p:first > strong > a`)
            .filter(`:contains("${filter_text}")`)
            .then(($a) => {
                const latest = $a
                    .text()
                    .trim()
                    .replace(filter_text, '')
                    .replace('released', '')
                    .trim()
                const current = v.version_current

                if (current === latest) {
                    expect(latest).not.to.be.null
                    cy.log(`Debian ${current} version has not been changed.`)
                } else {
                    const message = `New Debian **${latest}** \\(~${current}~\\) version released\\!`.replaceAll(".", "\\.")
                    sendMessage(token, chat_id, message).then(() => {
                        expect(current, latest).is.not.eq()
                    })
                }
            })
    })
})
