package ors_backend.ORS_backend

import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response

fun sendPostRequest(url: String, body: String): Response {
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