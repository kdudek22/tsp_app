package ors_backend.ORS_backend

import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service


@Service
class HttpService{

    @Value("\${ors_api_key}")
    private lateinit var apiKey: String

    fun sendPostRequest(url: String, body: String): Response {
        val client = OkHttpClient()
        val requestBody = body.toRequestBody()

        val request = Request.Builder()
            .url(url)
            .post(requestBody)
            .addHeader("Authorization", apiKey)
            .addHeader("Content-Type", "application/json")
            .build()

        return client.newCall(request).execute()
    }
}
