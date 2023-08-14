/// <reference types="cypress" />

import v from './alpine.json'
import { sendMessage } from '../request'

const token = Cypress.env('TELEGRAM_TOKEN') || ''
const chat_id = Cypress.env('TELEGRAM_CHAT_ID') || ''

describe(`Alpine ${v.version}`, () => {
    beforeEach(() => {
        cy.visit(v.release_page)
    })

    it(`check for latest ${v.version}`, () => {
        expect(token, 'telegram \'token\' is not provided').not.to.be.null
        expect(chat_id, 'telegram \'chat_id\' is not provided').not.to.be.null

        const $row = cy
            .get(`tr > td > a[href="https://gitlab.alpinelinux.org/alpine/aports/-/commits/${v.version}-stable"]`)
            .parent()
            .parent()

        const $version = $row
            .children('td')
            .eq(3)
            .children('a')
            .first()

        $version.then(($a) => {
            const latest = $a.text().trim()
            const current = v.version_current

            if (current === latest) {
                expect(latest, `Alpine ${current} version has not been changed`).not.to.be.null
            } else {
                const message = `New Alpine **${latest}** \\(~${current}~\\) version released\\!`.replaceAll(".", "\\.")
                sendMessage(token, chat_id, message).then(() => {
                    expect(current, latest).is.not.eq()
                })
            }
        })
    })
})
