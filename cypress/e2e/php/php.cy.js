/// <reference types="cypress" />

import v from './php.json'
import { sendMessage } from '../request'

const token = Cypress.env('TELEGRAM_TOKEN') || ''
const chat_id = Cypress.env('TELEGRAM_CHAT_ID') || ''

describe(`PHP ${v.version}`, () => {
    it(`check for latest ${v.version}`, () => {
        expect(token, 'telegram \'token\' is not provided').not.to.be.null
        expect(chat_id, 'telegram \'chat_id\' is not provided').not.to.be.null

        cy.request({
            url: v.release_page,
            method: 'GET',
            headers: {
                "content-Type": "application/json",
                'Accept': "application/json",
                'Cache-Control': 'no-cache',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
            }
        }).then((resp) => {
            const latest = resp.body[v.version].version
            const current = v.version_current

            if (current === latest) {
                expect(latest).not.to.be.null
                cy.log(`PHP ${current} version has not been changed.`)
            } else {
                const message = `New PHP **${latest}** \\(~${current}~\\) version released\\!`.replaceAll(".", "\\.")
                sendMessage(token, chat_id, message).then(() => {
                    expect(current, latest).is.not.eq()
                })
            }
        })
    })
})
