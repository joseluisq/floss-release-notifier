/// <reference types="cypress" />

import v from '../../versions.json'
import { sendMessage } from './request'

const token = Cypress.env('TELEGRAM_TOKEN') || ''
const chat_id = Cypress.env('TELEGRAM_CHAT_ID') || ''

describe(`Alpine ${v.alpine.version}`, () => {
    beforeEach(() => {
        cy.visit('https://alpinelinux.org/releases/')
    })

    it(`check for latest ${v.alpine.version}`, () => {
        expect(token, 'telegram \'token\' is not provided').not.to.be.null
        expect(chat_id, 'telegram \'chat_id\' is not provided').not.to.be.null

        const $row = cy
            .get(`tr > td > a[href="https://gitlab.alpinelinux.org/alpine/aports/-/commits/${v.alpine.version}-stable"]`)
            .parent()
            .parent()

        const $version = $row
            .children('td')
            .eq(3)
            .children('a')
            .first()

        $version.then(($a) => {
            const latest = $a.text()
            const current = v.alpine.version_current

            if (current === latest) {
                expect(latest, `Alpine ${current} version has not been changed`).not.to.be.null
            } else {
                const message = `New Alpine **${latest}** \\(~${current}~\\) version released\\!`.replaceAll(".", "\\.")
                sendMessage(token, chat_id, message).then(() => {
                    expect(latest, message).is.not.eq()
                })
            }
        })
    })
})
