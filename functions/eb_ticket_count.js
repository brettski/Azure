'use strict'

const https = require( 'https')
const token = process.env.EB_API_KEY    

module.exports = async function (context, req) {
    context.log('TicketCount triggered');
    context.res.headers = { 'Content-Type': 'application/json' }

    return new Promise((resolve, reject) => {
        context.log('promise land')
        var creq = https.get('https://www.eventbriteapi.com/v3/events/58614556717/ticket_classes/?token='+token, (res) => {
            context.log('https')
            let body = '';

            res.on('data', (chunk) => {
                body += chunk
                context.log('data chunk')
            })

            res.on('end', () => {
                context.log('end')
                const ticketdata = getNumbers(JSON.parse(body).ticket_classes)
                context.log(JSON.stringify(ticketdata))
                context.res.body = ticketdata
                resolve()
            })
        }).on('error', (error) => {
            context.log("error", error.message)
            reject(error)
        })
        creq.end()
    })
};

// accepts ticketpayload.ticket_classes
const getNumbers = (data) => {
    if (data.length < 1) {
        return
    }

    let returndata = {}
        data.forEach((e) => {
        returndata[e.name] = e.quantity_sold  
    })

    return returndata
}
