package expo.modules.bgsecure

import android.app.Activity
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.util.Log
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.ImageView
import android.widget.RelativeLayout
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.IOException
import java.net.URL

class BgSecureModule : Module() {
    private var overlayLayout: RelativeLayout? = null
    private var secureFlagWasSet: Boolean = false
    private var imagePath: String? = null
    private var backgroundColor: Int = Color.BLACK  // Default black
    private val TAG = "BgSecureModule"

    override fun definition() = ModuleDefinition {
        Name("BgSecure")

        Function("setBackgroundColor") { colorString: String ->
            Log.d(TAG, "Setting background color: $colorString")
            try {
                backgroundColor = Color.parseColor(colorString)
                Log.d(TAG, "Successfully set background color to: $colorString")
            } catch (e: IllegalArgumentException) {
                Log.e(TAG, "Invalid color format: $colorString")
                backgroundColor = Color.BLACK
            }
            // Update overlay if it exists
            val activity = appContext.currentActivity
            if (activity != null) {
                activity.runOnUiThread {
                    overlayLayout?.setBackgroundColor(backgroundColor)
                }
            }
        }

        Function("enabled") { enable: Boolean ->
            Log.d(TAG, "Setting secure flag: $enable")
            val activity = appContext.currentActivity
            activity?.runOnUiThread {
                if (enable) {
                    Log.d(TAG, "Adding FLAG_SECURE")
                    activity.window?.setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE)
                } else {
                    Log.d(TAG, "Clearing FLAG_SECURE")
                    activity.window?.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
                }
            }
        }

        Function("enableSecureView") { path: String ->
            Log.d(TAG, "Enabling secure view with image: $path")
            imagePath = path
            val activity = appContext.currentActivity
            if (activity != null) {
                activity.runOnUiThread {
                    createAndShowOverlay(activity)
                }
            } else {
                Log.e(TAG, "Activity is null")
            }
        }

        Function("disableSecureView") {
            Log.d(TAG, "Disabling secure view")
            imagePath = null
            val activity = appContext.currentActivity
            activity?.runOnUiThread {
                removeOverlay(activity)
                Log.d(TAG, "Clearing FLAG_SECURE")
                activity.window?.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
            }
        }

        OnActivityEntersForeground {
            Log.d(TAG, "Activity entering foreground")
            val activity = appContext.currentActivity
            if (activity != null) {
                activity.runOnUiThread {
                    removeOverlay(activity)
                    if (secureFlagWasSet) {
                        Log.d(TAG, "Restoring FLAG_SECURE")
                        activity.window?.setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE)
                        secureFlagWasSet = false
                    }
                }
            }
        }

        OnActivityEntersBackground {
            Log.d(TAG, "Activity entering background")
            val activity = appContext.currentActivity
            if (activity != null) {
                activity.runOnUiThread {
                    createAndShowOverlay(activity)
                    val flags = activity.window?.attributes?.flags ?: 0
                    if (flags and WindowManager.LayoutParams.FLAG_SECURE != 0) {
                        Log.d(TAG, "Storing FLAG_SECURE state")
                        activity.window?.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
                        secureFlagWasSet = true
                    } else {
                        secureFlagWasSet = false
                    }
                }
            }
        }
    }

    private fun removeOverlay(activity: Activity) {
        Log.d(TAG, "Removing overlay")
        if (overlayLayout != null) {
            val rootView = activity.window?.decorView?.rootView as? ViewGroup
            rootView?.removeView(overlayLayout)
            overlayLayout = null
        }
    }

    private fun createAndShowOverlay(activity: Activity) {
        Log.d(TAG, "Creating and showing overlay")
        // Remove any existing overlay first
        removeOverlay(activity)

        // Create new overlay
        overlayLayout = RelativeLayout(activity).apply {
            setBackgroundColor(backgroundColor)  // Use the stored background color
        }

        // Only create and add ImageView if we have an image path
        if (imagePath != null) {
            // Create an ImageView
            val imageView = ImageView(activity)
            val imageParams = RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                addRule(RelativeLayout.CENTER_IN_PARENT, RelativeLayout.TRUE)
            }

            imageView.layoutParams = imageParams

            val bitmap = decodeImageUrl(imagePath!!)
            if (bitmap != null) {
                val imageHeight = (bitmap.height * (activity.resources.displayMetrics.widthPixels.toFloat() / bitmap.width)).toInt()
                val scaledBitmap = Bitmap.createScaledBitmap(bitmap, activity.resources.displayMetrics.widthPixels, imageHeight, true)
                imageView.setImageBitmap(scaledBitmap)
                overlayLayout?.addView(imageView)
            }
        }

        // Add to window
        val rootView = activity.window?.decorView?.rootView as? ViewGroup
        val layoutParams = RelativeLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        )
        rootView?.addView(overlayLayout, layoutParams)
    }

    private fun decodeImageUrl(imagePath: String): Bitmap? {
        return try {
            Log.d(TAG, "Decoding image from URL: $imagePath")
            val imageUrl = URL(imagePath)
            BitmapFactory.decodeStream(imageUrl.openConnection().getInputStream())
        } catch (e: IOException) {
            Log.e(TAG, "Error decoding image: ${e.message}")
            e.printStackTrace()
            null
        }
    }
}
