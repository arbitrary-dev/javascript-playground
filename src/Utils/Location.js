import axios from "axios"

export async function getCoords(address) {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        format: 'jsonv2',
        q: address,
      }
    }
  )
  const data = response.data
  console.log("Coords retrieved:")
  console.log(data)
  return data
}

export async function getAddress(coords) {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/reverse",
    {
      params: {
        format: 'jsonv2',
        lat: coords.lat,
        lon: coords.lon,
        addressdetails: 0,
      }
    }
  )
  const data = response.data
  console.log("Address retrieved:")
  console.log(data)
  return data
}
