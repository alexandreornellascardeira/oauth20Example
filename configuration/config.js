module.exports = {
    "api_key": process.env.GOOGLE_API_KEY,
    "api_secret":  process.env.GOOGLE_API_SECRET,
    "callback_url": `${process.env.SERVER_URL}/auth/google/callback`
}
