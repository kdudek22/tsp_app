package ors_backend.ORS_backend

class Waypoint(val id: String, val lat: Double, val lng: Double){
    override fun toString(): String {
        return this.id + " " + this.lat + " " + this.lng
    }
}