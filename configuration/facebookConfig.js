module.exports = {
    "api_key":  process.env.FACEBOOK_API_KEY,
    "api_secret":  process.env.FACEBOOK_API_SECRET,
    "callback_url": `${process.env.SERVER_URL}/auth/facebook/callback`
}
