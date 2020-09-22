// import axios, { AxiosRequestConfig }  from "axios"
import Weather from './weather'
/*
	Fulfillment 
*/
const IntentMap = new Map()

IntentMap.set('weather-location', Weather)

export default IntentMap