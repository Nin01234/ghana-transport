// OAuth Configuration
export const authConfig = {
  google: {
    clientId: "98479576411-cngp72m4c29ld185mivi77pu1b6ba768.apps.googleusercontent.com",
    clientSecret: "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",
  },
  facebook: {
    appId: "your_facebook_app_id_here", // Replace with actual Facebook App ID
    appSecret: "your_facebook_app_secret_here", // Replace with actual Facebook App Secret
  },
  redirectUrl: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "",
}

// Google OAuth URL
export const getGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: authConfig.google.clientId,
    redirect_uri: authConfig.redirectUrl,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  })
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

// Facebook OAuth URL
export const getFacebookAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: authConfig.facebook.appId,
    redirect_uri: authConfig.redirectUrl,
    response_type: "code",
    scope: "email public_profile",
    state: "facebook_auth",
  })
  
  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
}
