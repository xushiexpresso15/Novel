import { createClient } from '@supabase/supabase-js'

const url = 'https://owehtfxlpgoejooqpmpe.supabase.co'
const key = 'sb_publishable_QcKWFuJxRX4XXi55vLaxWA_A1FficHy'

console.log(`Checking Supabase connection...`)

try {
    const supabase = createClient(url, key)
    console.log('Client initialized.')

    supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
            console.error('Auth Error:', error.message) // Error message is key
            console.error('Error Details:', JSON.stringify(error, null, 2))
        } else {
            console.log('Auth Session Check: Success')
        }
    }).catch(err => {
        console.error('Auth Exception:', err)
    })

} catch (e: any) {
    console.error('Initialization Error:', e.message)
}
