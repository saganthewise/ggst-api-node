const steamSession = require('steam-session');
const SteamUser = require('steam-user');

// Strive's AppID
const striveID = 1384160;

// Payload to be sent to Strive servers for login
var userPayload;

async function SteamLogin(steamToken, steamUser, steamPass) {
    return new Promise(async (resolve, reject) => {
        // I want to remove SessionInit to improve runtime a bit, but:
        // 1) SessionInit is necessary on the initial Steam login to fetch the refresh token, and
        // 2) Every time I remove this call, my the test for this function only works for another try or two before failing.
        // Also, whenever I add this function call back, it takes another try or two before the tests pass again.
        // I have no clue why this oddly specific behavior is happening, but it is, and I'm fairly certain I'm to blame.
        await SessionInit(steamToken, steamUser, steamPass);
        await SteamInit(steamToken, steamUser, steamPass);

        // Wait for a few seconds then send out payload
        // I thought using 'await' would prevent the code from
        // reaching this part until the 'await'-ed function terminates?
        setTimeout(() => {
            resolve(userPayload);
        }, 2000)
    })
}

// Initialize Steam session, useful for fetching
// a refresh token to log back into the account without much hassle
async function SessionInit(steamToken, steamUser, steamPass) {
    const session = new steamSession.LoginSession(steamSession.EAuthTokenPlatformType.SteamClient);

    if (steamToken) {
        session.refreshToken = steamToken;
        return session.steamID.getSteamID64();
    }

    // If a refresh token is already in the environment variables, use that
    // Else, use login credentials
    const credentials = {
        'accountName': steamUser,
        'password': steamPass
    }

    const start = await session.startWithCredentials(credentials);

    // This section takes care of Steam guard
    // Just wait for notification on phone and authorize login
    // Got to add more Steam Guard cases
    if (start.actionRequired) {
        if (start.validActions.some(action => action.type === steamSession.EAuthSessionGuardType.DeviceConfirmation)) {
            try {
                start.qrChallengeUrl()
            } catch (ex) {
                process.exit(1);
            }
        }
    }

    // Listener functions for different cases
    session.on('authenticated', async () => {
        return session.steamID.getSteamID64();
    });

    session.on('timeout', () => {
        console.log('This login attempt has timed out.');
        return false;
    });

    session.on('error', (err) => {
        // This should ordinarily not happen. This only happens in case there's some kind of unexpected error while
        // polling, e.g. the network connection goes down or Steam chokes on something.
        console.log(err.message);
        return false;
    });

}

async function SteamInit(steamToken, steamUser, steamPass) {
    const user = new SteamUser();

    // Log in to Steam's servers with either the refresh token or the user's account name + password
    var loginCreds = steamToken ? {
        'refreshToken': steamToken,
        'machineName': 'fightstats-dev'
    } : {
        'accountName': steamUser,
        'password': steamPass,
        'machineName': 'fightstats-dev'
    }

    user.logOn(loginCreds);

    user.on('loggedOn', async () => {
        // Get authorization ticket, all the fancy stuff is apparently already done in the package
        const authTicket = await user.createAuthSessionTicket(striveID);

        // Set up payload with the SteamID and auth ticket to be sent to Strive's servers
        userPayload = {
            'id': user.steamID.getSteamID64(),
            'token': authTicket.sessionTicket.toString('hex')
        }
    });
}

module.exports = {
    SteamLogin: SteamLogin
}