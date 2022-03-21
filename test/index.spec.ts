import { getApiKey, setApiKey, fetchSimpleProduct } from '../src/index'

const mockPropertiesFor = (mockImplementations = {}) => {
  const mockProperties = () => {
    return ({
      ...mockImplementations,
    } as unknown) as GoogleAppsScript.Properties.Properties
  }

  global.PropertiesService = {
    getUserProperties: () => mockProperties(),
    getDocumentProperties: () => mockProperties(),
    getScriptProperties: () => mockProperties(),
  }
}

const mockRequest = (statusCode: number, contextText: string) => {
  global.UrlFetchApp = ({
    fetch: jest.fn().mockReturnValue(({
      getResponseCode: () => statusCode,
      getContentText: () => contextText,
    } as unknown) as GoogleAppsScript.URL_Fetch.HTTPResponse),
  } as unknown) as GoogleAppsScript.URL_Fetch.UrlFetchApp
}

const mockLogger = () => {
  global.Logger = ({
    log: jest.fn(),
  } as unknown) as GoogleAppsScript.Base.Logger
}

describe('#getApiKey', () => {
  it('should get api key', () => {
    const getProperty = jest.fn().mockReturnValue('42')
    mockPropertiesFor({ getProperty })
    expect(getApiKey()).toBe('42')
    expect(getProperty).toBeCalledWith('bling_api_key')
  })
})

describe('#setApiKey', () => {
  it('should save api key', () => {
    const setProperty = jest.fn()
    mockPropertiesFor({ setProperty })
    setApiKey('21')
    expect(setProperty).toBeCalledWith('bling_api_key', '21')
  })
})

describe('fetchSimpleProduct', () => {
  it('should fetch simple product', () => {
    mockLogger()
    mockPropertiesFor({ getProperty: jest.fn().mockReturnValue('my-key') })
    mockRequest(200, '{"sku":42}')

    expect(fetchSimpleProduct('42')).toEqual({ sku: 42 })
    expect(UrlFetchApp.fetch).toBeCalledWith(
      'https://bling.com.br/Api/v2/produto/42?estoque=S&apikey=my-key',
    )
  })
  it('should throw when no api key defined', () => {
    mockPropertiesFor({ getProperty: jest.fn().mockReturnValue('') })
    expect(() => fetchSimpleProduct('42')).toThrow('API key not found')
  })
  it('should throw when statusCode is not 200', () => {
    mockPropertiesFor({ getProperty: jest.fn().mockReturnValue('my-key') })
    mockRequest(404, '{"error":"product not found"}')
    expect(() => fetchSimpleProduct('42')).toThrow('Error to fetch product')
  })
})
