/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/8/10 11:10 上午
 */

const SZCode = {
  '罗湖区': '440304',
  '福田区': '440303',
  '南山区': '440305',
  '盐田区': '440308',
  '龙岗区': '440307',
  '宝安区': '440306',
  '龙华区': '440309',
  '坪山区': '440310',
  '光明区': '440311',
  '大鹏区': '440312',
}

const areaInfo = [
  {
    'name': '大鹏新区',
    'num': 0,
    'position': [114.47685241699217, 22.63478596348914],
    'code': '440312',
  },
  {
    'name': '坪山区',
    'num': 3,
    'position': [114.367511, 22.729989],
    'code': '440310',
  },
  {
    'name': '龙岗区',
    'num': 18,
    'position': [114.276099, 22.76945],
    'code': '440307',
  },
  {
    'name': '福田区',
    'num': 34,
    'position': [114.055105, 22.55494],
    'code': '440303',
  },
  {
    'name': '盐田区',
    'num': 3,
    'position': [114.269775, 22.611002],
    'code': '440308',
  },
  {
    'name': '罗湖区',
    'num': 28,
    'position': [114.161116, 22.582173],
    'code': '440304',
  },
  {
    'name': '南山区',
    'num': 35,
    'position': [113.952997, 22.594453],
    'code': '440305',
  },
  {
    'name': '龙华区',
    'num': 7,
    'position': [114.049356, 22.725722],
    'code': '440309',
  }, {
    'name': '光明区',
    'num': 3,
    'position': [113.928276, 22.807301],
    'code': '440311',
  }, {
    'name': '宝安区',
    'num': 21,
    'position': [113.842387, 22.688518],
    'code': '440306',
  },
]

const AreasData = [
  { name: '罗湖区', code: '440304', onclick: false, stateName: 'pannelAreas' , lon: '114.161116', lat:'22.562173'},
  { name: '福田区', code: '440303', onclick: false, stateName: 'pannelAreas' , lon: '114.055105', lat:'22.54494'},
  { name: '南山区', code: '440305', onclick: false, stateName: 'pannelAreas' , lon: '113.952997', lat:'22.584453'},
  { name: '盐田区', code: '440308', onclick: false, stateName: 'pannelAreas' , lon: '114.269775', lat:'22.601002'},
  { name: '龙岗区', code: '440307', onclick: false, stateName: 'pannelAreas' , lon: '114.276099', lat:'22.72945'},
  { name: '宝安区', code: '440306', onclick: false, stateName: 'pannelAreas' , lon: '113.842387', lat:'22.668518'},
  { name: '龙华区', code: '440309', onclick: false, stateName: 'pannelAreas' , lon: '114.049356', lat:'22.695722'},
  { name: '坪山区', code: '440310', onclick: false, stateName: 'pannelAreas' , lon: '114.367511', lat:'22.689989'},
  { name: '光明区', code: '440311', onclick: false, stateName: 'pannelAreas' , lon: '113.928276', lat:'22.757301'},
  { name: '大鹏区', code: '440312', onclick: false, stateName: 'pannelAreas' , lon: '114.496099', lat:'22.60945'},
]

const AacompanysData = [
  { name: '中国银行', code: 'boc', onclick: false, stateName: 'pannelAacompanys' },
  { name: '工商银行', code: 'icbc', onclick: false, stateName: 'pannelAacompanys' },
  { name: '农业银行', code: 'abc', onclick: false, stateName: 'pannelAacompanys' },
  { name: '建设银行', code: 'ccb', onclick: false, stateName: 'pannelAacompanys' },
  { name: '招商银行', code: 'cmb', onclick: false, stateName: 'pannelAacompanys' },
]

const BusinessData = [
  { name: '网点金融资产规模', code: 'asset', onclick: false, stateName: 'pannelBusiness' },
]


export { SZCode, areaInfo, AreasData, AacompanysData, BusinessData }
