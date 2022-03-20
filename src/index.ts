/**
 * get api key for user
 */
function getApiKey(): any {
  return UserProperties.getProperty('bling_api_key')
}

/**
 * set api key for user
 *
 * @param apiKey string api key to set to user
 */
function setApiKey(apiKey: string): void {
  UserProperties.setProperty('bling_api_key', apiKey)
}
