import { AirThai } from "air-thai-api"
import { IConv } from "../interface"

const Weather = async (data:IConv) => {
  const { parameters } = data
  console.log('parameters:',parameters)
  const result = await AirThai({ lat: 13.670809600000002, long: 100.6501888 })
  console.log('result',result)
  return `{ text: "นี่งับ", type: "text"}`
}
export default Weather