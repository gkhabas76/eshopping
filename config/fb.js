module.exports = {
    'googleAuth': {
        'clientID': '394864585917-q6vf13jh7b1jgp3a6jb145nmk13orri3.apps.googleusercontent.com',
        'clientSecret': 'dRgRyhECiLqEymaAX18Gcu1V',
        'callbackURL': 'http://localhost:3000/auth/google/callback'
    },

    facebook: {
        clientID: process.env.FACEBOOK_ID || '382512178977157',
        clientSecret: process.env.FACEBOOK_SECRET || '06e1030639b69eec74f49bca46f7ab03',
        profileFields: ['emails', 'displayName'],
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
}