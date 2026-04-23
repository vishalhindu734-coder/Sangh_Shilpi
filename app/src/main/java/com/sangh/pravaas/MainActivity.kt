package com.sangh.pravaas

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        
        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true      
        webSettings.domStorageEnabled = true       
        webSettings.allowFileAccess = true        
        webSettings.allowContentAccess = true
        webSettings.useWideViewPort = true
        webSettings.loadWithOverviewMode = true
        
        webView.webViewClient = WebViewClient()

        // स्थानीय एसेट फ़ाइल लोड करें
        webView.loadUrl("file:///android_asset/index.html")

        setContentView(webView)
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
