import { Modal } from "./UI/Modal"
import { Map } from "./UI/Map"
import * as L from "./Utils/Location"

const DEF_POPUP = "You are here!"

class PlaceFinder {

  constructor() {
    document.querySelector("#place-data form")
      .addEventListener('submit', this.onSubmit.bind(this))

    document.getElementById("locate-btn")
      .addEventListener('click', this.onLocate.bind(this))

    this.shareLink = document.getElementById("share-link")
    this.shareBtn = document.getElementById("share-btn")

    this.shareBtn.addEventListener('click', this.onShare.bind(this))
  }

  onShare() {
    if (navigator.clipboard) {
      const link = this.shareLink.value
      navigator.clipboard.writeText(link)
        .then(alert(`Copied to clipboard:\n\n${link}`))
    } else {
      this.shareLink.select()
    }
  }

  onLocate() {
    const modal = new Modal('loading-modal-content')
    modal.show()
    new Promise(r => setTimeout(r, 1000 * (1 + Math.random())))
      .then(() => new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      ))
      .then(result =>
        L.getAddress({
          lon: result.coords.longitude,
          lat: result.coords.latitude,
        }))
      .then(data => {
        const { lon, lat, display_name } = data
        this.showLocation({lon, lat}, display_name)
      })
      .catch(error => {
        alert(
          `${error.message}\n\nNo location services for you, pal!\n\n` +
          "…but I can generate something randomly for you."
        )
        this.showLocation({
          lon: 24.1052 + Math.random(), // 260 * Math.random() - 180
          lat: 56.9496 + Math.random(), // 180 * Math.random() - 90
        })
      })
      .finally(() => modal.hide())
  }

  async onMapClick(coords) {
    console.log(`Coords clicked: ${coords}`)
    const { lon, lat, display_name } = await L.getAddress(coords)
    this.showLocation({lon, lat}, display_name)
  }

  showLocation(coords, address) {
    if (!this.map)
      this.map = new Map(this.onMapClick.bind(this))
    this.map.render(coords, address || DEF_POPUP)

    let params = { ...coords }
    if (address)
      params.address = encodeURIComponent(address)
    params = Object.entries(params)
    params = params.map(([k, v]) => `${k}=${v}`).join('&')

    this.shareLink.value = `${location.origin}/my-place?${params}`
    this.shareBtn.disabled = false
  }

  async onSubmit(e) {
    e.preventDefault()

    const address = e.target.querySelector("input").value.trim()

    if (!address) {
      alert("Type address to look out first!")
      return
    }

    const modal = new Modal("loading-modal-content")
    modal.show()
    const data = await L.getCoords(address)
    modal.hide()

    if (data.length) {
      const { lon, lat, display_name } = data[0]
      this.showLocation({lon, lat}, display_name)
    }
  }
}

new PlaceFinder()
