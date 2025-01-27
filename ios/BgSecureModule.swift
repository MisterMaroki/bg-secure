import ExpoModulesCore
import UIKit

struct DisableScreenshot {
    private static let textField = UITextField()
    private static let secureView = textField.subviews.first { NSStringFromClass(type(of: $0)).contains("TextLayoutCanvasView") }

    static func disableScreenshots(layer: CALayer) {
        guard let secureView = Self.secureView else { return }

        let previousLayer = secureView.layer
        secureView.setValue(layer, forKey: "layer")
        Self.textField.isSecureTextEntry = true
        secureView.setValue(previousLayer, forKey: "layer")
    }
    
    static func enable() {
        DispatchQueue.main.async {
            guard let window = UIApplication.shared.windows.first else { return }
            window.layer.disableScreenshots()
            print("🛡️ [BGSecure] Screenshot protection enabled")
        }
    }
    
    static func disable() {
        DispatchQueue.main.async {
            Self.textField.isSecureTextEntry = false
            print("🛡️ [BGSecure] Screenshot protection disabled")
        }
    }
}

extension CALayer {
    func disableScreenshots() {
        DisableScreenshot.disableScreenshots(layer: self)
    }
}

public class BgSecureModule: Module {
    public func definition() -> ModuleDefinition {
        Name("BgSecure")
        
        Function("enableSecureView") { (imagePath: String?) in
            DisableScreenshot.enable()
        }
        
        Function("disableSecureView") {
            DisableScreenshot.disable()
        }
        
        // Events
        Events("onScreenshot")
        
        OnCreate {
            NotificationCenter.default.addObserver(
                self,
                selector: #selector(self.handleScreenshot),
                name: UIApplication.userDidTakeScreenshotNotification,
                object: nil
            )
        }
    }
    
    @objc private func handleScreenshot() {
        print("📸 [BGSecure] Screenshot detected!")
        sendEvent("onScreenshot", [:])
    }
}

