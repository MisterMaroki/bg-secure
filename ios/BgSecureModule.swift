import ExpoModulesCore
import UIKit

struct DisableScreenshot {
    private static let textField = UITextField()
    private static let secureView = textField.subviews.first { NSStringFromClass(type(of: $0)).contains("TextLayoutCanvasView") }
    
    static func setupSecureTextField(with imagePath: String?) {
        DispatchQueue.main.async {
            guard let window = UIApplication.shared.windows.first else { return }
            let rootView = window
            
            // Configure text field
            textField.frame = rootView.frame
            textField.isSecureTextEntry = true
            textField.isUserInteractionEnabled = false
            
            if let imagePath = imagePath, !imagePath.isEmpty {
                print("🛡️ [BGSecure] Attempting to load image from path:", imagePath)
                
                // Get the module bundle
                let bundle = Bundle(for: BgSecureModule.self)
                
                // Try different ways to load the image
                let image: UIImage? = {
                    // First try loading from assets
                    if let image = UIImage(named: imagePath, in: bundle, compatibleWith: nil) {
                        print("🛡️ [BGSecure] Loaded image from bundle assets")
                        return image
                    }
                    
                    // Then try loading from file path
                    if let image = UIImage(contentsOfFile: imagePath) {
                        print("🛡️ [BGSecure] Loaded image from file path")
                        return image
                    }
                    
                    // Finally try loading from URL
                    if let url = URL(string: imagePath),
                       let data = try? Data(contentsOf: url),
                       let image = UIImage(data: data) {
                        print("🛡️ [BGSecure] Loaded image from URL")
                        return image
                    }
                    
                    print("🛡️ [BGSecure] Failed to load image from all methods")
                    return nil
                }()
                
                if let image = image {
                    let screenSize = rootView.frame.size
                    
                    // Create a renderer with the screen size
                    let renderer = UIGraphicsImageRenderer(size: screenSize)
                    let scaledImage = renderer.image { context in
                        // Fill background with clear color
                        UIColor.clear.setFill()
                        context.fill(CGRect(origin: .zero, size: screenSize))
                        
                        // Calculate aspect ratio scaling
                        let imageSize = image.size
                        let widthRatio = screenSize.width / imageSize.width
                        let heightRatio = screenSize.height / imageSize.height
                        
                        // Use the smaller ratio to ensure image fits within screen
                        let scale = min(widthRatio, heightRatio) * 0.8 // 80% of the fitting size for padding
                        let scaledWidth = imageSize.width * scale
                        let scaledHeight = imageSize.height * scale
                        
                        // Calculate center position
                        let x = (screenSize.width - scaledWidth) / 2
                        let y = (screenSize.height - scaledHeight) / 2
                        
                        // Draw image centered
                        image.draw(in: CGRect(x: x, y: y, width: scaledWidth, height: scaledHeight))
                    }
                    
                    textField.backgroundColor = UIColor(patternImage: scaledImage)
                    print("🛡️ [BGSecure] Successfully set image as background")
                }
            }
            
            rootView.sendSubviewToBack(textField)
            rootView.addSubview(textField)
            rootView.layer.superlayer?.addSublayer(textField.layer)
            textField.layer.sublayers?.last?.addSublayer(rootView.layer)
            
            print("🛡️ [BGSecure] Screenshot protection enabled")
        }
    }

    static func disableScreenshots(layer: CALayer) {
        guard let secureView = Self.secureView else { return }

        let previousLayer = secureView.layer
        secureView.setValue(layer, forKey: "layer")
        Self.textField.isSecureTextEntry = true
        Self.textField.isUserInteractionEnabled = false
        secureView.setValue(previousLayer, forKey: "layer")
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
            DisableScreenshot.setupSecureTextField(with: imagePath)
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

