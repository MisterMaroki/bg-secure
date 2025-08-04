package expo.modules.bgsecure

import android.app.Dialog
import android.view.WindowManager
import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.os.Handler
import android.os.Looper

class BgSecureModule : Module() {
    private var secureDialog: Dialog? = null
    private val TAG = "BgSecureModule"
    private val mainHandler = Handler(Looper.getMainLooper())

    override fun definition() = ModuleDefinition {
        Name("BgSecure")

        OnCreate {
            Log.d(TAG, "OnCreate called")
            val activity = appContext.currentActivity
            if (activity == null) {
                Log.e(TAG, "Activity is null in OnCreate")
                return@OnCreate
            }
            Log.d(TAG, "Activity found: ${activity.javaClass.simpleName}")
            
            // Run UI operations on main thread
            mainHandler.post {
                try {
                    // Set FLAG_SECURE initially
                    activity.window?.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
                    Log.d(TAG, "Initial FLAG_SECURE set")
                    
                    activity.window?.let { window ->
                        val originalCallback = window.callback
                        window.callback = object : android.view.Window.Callback by originalCallback {
                            override fun onWindowFocusChanged(hasFocus: Boolean) {
                                Log.d(TAG, "onWindowFocusChanged: hasFocus=$hasFocus")
                                // Run UI operations on main thread
                                mainHandler.post {
                                    try {
                                        if (hasFocus) {
                                            // Set FLAG_SECURE when app is focused
                                            window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
                                            Log.d(TAG, "Added FLAG_SECURE")
                                            secureDialog?.let { dialog ->
                                                dialog.dismiss()
                                                secureDialog = null
                                                Log.d(TAG, "Dismissed secure dialog")
                                            }
                                        } else {
                                            // Remove FLAG_SECURE when app is not focused
                                            window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
                                            Log.d(TAG, "Cleared FLAG_SECURE")

                                            if (secureDialog == null) {
                                                // Create and show the dialog
                                                try {
                                                    Dialog(activity, android.R.style.Theme_Black_NoTitleBar_Fullscreen).also { dialog ->
                                                        dialog.window?.setFlags(
                                                            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                                                            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                                                        )
                                                        dialog.setContentView(R.layout.secure_screen_layout)
                                                        secureDialog = dialog
                                                        dialog.show()
                                                        Log.d(TAG, "Showed secure dialog")
                                                    }
                                                } catch (e: Exception) {
                                                    Log.e(TAG, "Error showing dialog", e)
                                                }
                                            }
                                        }
                                    } catch (e: Exception) {
                                        Log.e(TAG, "Error in onWindowFocusChanged", e)
                                    }
                                }
                                // Call original callback on the original thread
                                originalCallback.onWindowFocusChanged(hasFocus)
                            }
                        }
                        Log.d(TAG, "Window callback set successfully")
                    } ?: run {
                        Log.e(TAG, "Window is null")
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error in OnCreate", e)
                }
            }
        }
    }
}
