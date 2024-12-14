package ors_backend.ORS_backend

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.web.bind.annotation.*


@CrossOrigin(origins = ["*"])
@RestController
@RequestMapping("/api")
class TSPController(private val httpService: HttpService) {

    @PostMapping("/matrix")
    fun getDurationMatrix(@RequestParam(name="transport_type", defaultValue="driving-car") transportType: String, @RequestBody waypoints: List<Waypoint>): Map<String, Any> {
        val transformedWaypoints = waypoints.map{arrayOf(it.lng, it.lat)}

        val response = httpService.sendPostRequest("https://api.openrouteservice.org/v2/matrix/${transportType}",
            jacksonObjectMapper().writeValueAsString(mapOf("locations" to transformedWaypoints, "metrics" to arrayOf("distance", "duration"))))

        val responseString = response.body?.string() ?: "No response body"

        return mapOf("response" to responseString)
    }

    @PostMapping("/route")
    fun getRoute(@RequestParam(name="transport_type", defaultValue="driving-car") transportType: String, @RequestBody waypoints: List<Waypoint>): Map<String, Any> {
        val transformedWaypoints = waypoints.map{arrayOf(it.lng, it.lat)}

        val response = httpService.sendPostRequest("https://api.openrouteservice.org/v2/directions/${transportType}/geojson",
            jacksonObjectMapper().writeValueAsString(mapOf("coordinates" to transformedWaypoints, "radiuses" to arrayOf(-1))))


        val responseString = response.body?.string() ?: "No response body"

        return mapOf("response" to responseString)
    }

}