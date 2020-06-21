import { Map } from "./UI/Map"

class Place {

  constructor(coords, address) {
    document.querySelector('h1').textContent =
      address ? address : "Some distant place"

    const map = new Map()
    map.render(coords, address)
  }
}

const params = new URL(location.href).searchParams
const address = params.get('address')
const coords = {
  lon: +params.get('lon'),
  lat: +params.get('lat'),
}

new Place(coords, address)
