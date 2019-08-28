/* oncall 项目地址（config示例） */
import tld from 'tldjs'

const HOST = window.location.host

const config = {
  'prod': {
    origin: '//iboxadmin.isesol.com',
    originExport: '//iboxexport.isesol.com',
    api: '//api.isesol.com',
    fileFTP: '//oncall.isesol.com/oncallapi',
    qiNiu: '//upload.qbox.me/',
    bdapi: 'https://api.map.baidu.com/geocoder/v2/?coordtype=gcj02ll&extensions_poi=1&output=json&s=1'
  },
  'test': {
    origin: '//iboxadmin.i5sesol.com',
    originExport: '//iboxexport.i5sesol.com',
    api: '//api.i5sesol.com',
    fileFTP: '//oncall.i5sesol.com/oncallapi',
    qiNiu: '//upload.qbox.me/',
    bdapi: 'https://api.map.baidu.com/geocoder/v2/?coordtype=gcj02ll&extensions_poi=1&output=json&s=1'
  },
  'dev': {
    origin: '//iboxadmin.isesoldev.com',
    originExport: '//iboxexport.isesoldev.com',
    api: '//api.isesoldev.com',
    fileFTP: '//oncall.isesoldev.com/oncallapi',
    qiNiu: '//upload.qiniu.com/',
    bdapi: 'http://api.map.baidu.com/geocoder/v2/?coordtype=gcj02ll&extensions_poi=1&output=json'
  }
}

// 获取域名
function createDomain (host) {
  let DOMAIN = {}
  let topDomain = tld.getDomain(host)
  if (topDomain === 'isesol.com') {
    DOMAIN = config['prod']
  } else if (topDomain === 'i5sesol.com') {
    DOMAIN = config['test']
  } else {
    DOMAIN = config['dev']
  }
  DOMAIN.tld = topDomain
  DOMAIN.apiPath = DOMAIN.api + '/cgi'
  return DOMAIN
}

export const DOMAIN = createDomain(HOST)
export const TOKEN_NAME = 'userToken'
// export const TOKEN_NAME = 'userToken'
