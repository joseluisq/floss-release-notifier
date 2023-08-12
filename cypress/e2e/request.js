export function sendMessage(token, chat_id, message) {
    return cy.request({
        method:'POST',
        url: `https://api.telegram.org/bot${token}/sendMessage`,
        body: {
            chat_id: chat_id,
            text: message,
            parse_mode: 'MarkdownV2'
        },
        headers: {
            'Content-Type': 'application/json',
        }
    })
}
