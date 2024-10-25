package com.example.demo.test

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.web.bind.annotation.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.RequestBody as RB
import okhttp3.Response
import java.io.IOException

class Waypoint(val id: String, val lat: Double, val lng: Double){
    override fun toString(): String {
        return this.id + " " + this.lat + " " + this.lng
    }
}

fun sendPostRequest(url: String, body: String): Response{
    val client = OkHttpClient()
    val requestBody = body.toRequestBody()

    val request = Request.Builder()
        .url(url)
        .post(requestBody)
        .addHeader("Authorization", "5b3ce3597851110001cf62487142604a89c04e778b3add6bf1387dee")
        .addHeader("Content-Type", "application/json")
        .build()

    return client.newCall(request).execute()
}

@CrossOrigin(origins = ["*"])
@RestController
@RequestMapping("/api")
class TSPController {

    @PostMapping("/test")
    fun testResponse(@RequestBody waypoints: List<Waypoint>): Map<String, Any> {
        val transformedWaypoints = waypoints.map{arrayOf(it.lng, it.lat)}

//        val response = sendPostRequest("https://api.openrouteservice.org/v2/matrix/driving-car",
//            jacksonObjectMapper().writeValueAsString(mapOf("locations" to transformedWaypoints)))
//
//        val responseString = response.body?.string() ?: "No response body"

        val response = sendPostRequest("https://api.openrouteservice.org/v2/directions/driving-car/geojson",
            jacksonObjectMapper().writeValueAsString(mapOf("coordinates" to transformedWaypoints + arrayOf(transformedWaypoints.first()))))


        val responseString = response.body?.string() ?: "No response body"

        return mapOf("response" to responseString)
    }

}