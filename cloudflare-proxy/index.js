addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event))
})

const domain = 'postmaster.bluemethyst.dev'

async function handleRequest(event) {
    const url = new URL(event.request.url)

    if (url.pathname === '/track' && url.searchParams.has('tracking_reference')) {
        const trackingReference = url.searchParams.get('tracking_reference')
        const newUrl = `https://tools.nzpost.co.nz/tracking/api/parceltrack/parcels?tracking_reference=${trackingReference}`
        const response = await fetch(newUrl, {
            ...event.request,
            method: 'GET'
        })

        const headers = new Headers(response.headers)
        headers.set('Access-Control-Allow-Origin', domain)
        headers.set('Access-Control-Allow-Methods', 'GET')
        headers.set('Access-Control-Allow-Headers', 'Content-Type')

        return new Response(response.body, {
            status: response.status,
            headers
        })
    } else if (url.pathname === '/image' && url.searchParams.has('tracking_reference')) {
        const trackingReference = url.searchParams.get('tracking_reference')
        const newUrl = `https://tools.nzpost.co.nz/tracking/api/image?tn=${trackingReference}`
        const response = await fetch(newUrl, {
            ...event.request,
            method: 'GET'
        })

        const headers = new Headers(response.headers)
        headers.set('Access-Control-Allow-Origin', domain)
        headers.set('Access-Control-Allow-Methods', 'GET')
        headers.set('Access-Control-Allow-Headers', 'Content-Type')

        return new Response(response.body, {
            status: response.status,
            headers
        })
    } else {
        return new Response(JSON.stringify({ error: 'Not Found' }), {
            status: 404
        })
    }
}
