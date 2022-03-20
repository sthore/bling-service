// Documentação: https://ajuda.bling.com.br/hc/pt-br/categories/360002186394-API-para-Desenvolvedores
const BASE_URL = 'https://bling.com.br/Api/v2'

/**
 * get api key for user
 */
function getApiKey(): any {
  return PropertiesService.getUserProperties().getProperty('bling_api_key')
}

/**
 * set api key for user
 *
 * @param apiKey string Api key to set to user
 */
function setApiKey(apiKey: string): void {
  PropertiesService.getUserProperties().setProperty('bling_api_key', apiKey)
}

/**
 * Fetch simple product information
 *
 * @param sku string The product sku
 */
function fetchSimpleProduct(sku: string) {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('API Key not found')
  }
  const url = `${BASE_URL}/produto/${sku}?estoque=S&apikey=`
  Logger.log({ message: `GET ${url}` })
  const fetchData = UrlFetchApp.fetch(`${url}${apiKey}`)
  const data = JSON.parse(fetchData.getContentText())
  Logger.log({ message: 'Fetched data', data })
  return data
}
