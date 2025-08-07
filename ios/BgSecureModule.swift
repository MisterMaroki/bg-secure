import ExpoModulesCore



public final class BgSecureModule: Module {
  private var blockView = UIView()
  private var solidView: BgSecureView?


  private var keyWindow: UIWindow? {
    return UIApplication.shared.connectedScenes
      .flatMap { ($0 as? UIWindowScene)?.windows ?? [] }
      .last { $0.isKeyWindow }
  }

  public func definition() -> ModuleDefinition {
    Name("BgSecure")



    OnCreate {
      let boundLength = max(UIScreen.main.bounds.size.width, UIScreen.main.bounds.size.height)
      blockView.frame = CGRect(x: 0, y: 0, width: boundLength, height: boundLength)
      blockView.backgroundColor = .black
    }

    OnDestroy {
      disableAppSwitcherProtection()
    }

    AsyncFunction("enableSecureView") {
      self.preventScreenRecording()

      NotificationCenter.default.addObserver(
        self,
        selector: #selector(self.preventScreenRecording),
        name: UIScreen.capturedDidChangeNotification,
        object: nil
      )
    }.runOnQueue(.main)

    AsyncFunction("disableSecureView") {
      NotificationCenter.default.removeObserver(
        self,
        name: UIScreen.capturedDidChangeNotification,
        object: nil
      )
    }.runOnQueue(.main)

    AsyncFunction("enableAppSwitcherProtection") {
      enableAppSwitcherProtection()
    }.runOnQueue(.main)

    AsyncFunction("disableAppSwitcherProtection") {
      disableAppSwitcherProtection()
    }.runOnQueue(.main)

    AsyncFunction("forceRemovePrivacyOverlay") {
      removePrivacyOverlay()
    }.runOnQueue(.main)


  }



  @objc
  func preventScreenRecording() {
    guard let keyWindow = keyWindow,
          let visibleView = keyWindow.subviews.first else { return }
    let isCaptured = UIScreen.main.isCaptured

    if isCaptured {
      visibleView.addSubview(blockView)
    } else {
      blockView.removeFromSuperview()
    }
  }



  private func enableAppSwitcherProtection() {
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(appWillResignActive),
      name: UIApplication.willResignActiveNotification,
      object: nil
    )

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(appDidBecomeActive),
      name: UIApplication.didBecomeActiveNotification,
      object: nil
    )
    
    // Also listen for app entering foreground (handles lock/unlock scenarios)
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(appWillEnterForeground),
      name: UIApplication.willEnterForegroundNotification,
      object: nil
    )
  }

  private func disableAppSwitcherProtection() {
    NotificationCenter.default.removeObserver(
      self,
      name: UIApplication.willResignActiveNotification,
      object: nil
    )

    NotificationCenter.default.removeObserver(
      self,
      name: UIApplication.didBecomeActiveNotification,
      object: nil
    )
    
    NotificationCenter.default.removeObserver(
      self,
      name: UIApplication.willEnterForegroundNotification,
      object: nil
    )

    removePrivacyOverlay()
  }

  @objc
  private func appWillResignActive() {
    showPrivacyOverlay()
  }

  @objc
  private func appDidBecomeActive() {
    removePrivacyOverlay()
  }
  
  @objc
  private func appWillEnterForeground() {
    // Additional cleanup when app enters foreground (handles lock/unlock)
    removePrivacyOverlay()
  }

  private func showPrivacyOverlay() {
    // Don't create multiple overlays
    guard self.solidView == nil else {
      return
    }
    
    if let keyWindow = keyWindow,
       let rootView = keyWindow.subviews.first {
      let solidView = BgSecureView()
      solidView.frame = rootView.bounds
      solidView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
      solidView.alpha = 0

      rootView.addSubview(solidView)
      self.solidView = solidView

      UIView.animate(
        withDuration: 0.3,
        delay: 0,
        options: [.curveEaseOut],
        animations: {
          solidView.alpha = 1.0
        }
      )
    }
  }

  private func removePrivacyOverlay() {
    guard let solidView = self.solidView else {
      return
    }
    
    // Cancel any ongoing animations to prevent conflicts
    solidView.layer.removeAllAnimations()
    
    UIView.animate(
      withDuration: 0.25,
      delay: 0,
      options: [.curveEaseIn, .beginFromCurrentState],
      animations: {
        solidView.alpha = 0
      },
      completion: { _ in
        solidView.removeFromSuperview()
        self.solidView = nil
      }
    )
  }
}

// Advanced screenshot protection utilities adapted for component-level protection
struct ComponentScreenshotProtection {
    static func enableProtection(for view: UIView) -> UITextField? {
        let secureTextField = UITextField()
        secureTextField.frame = view.bounds
        secureTextField.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        secureTextField.isSecureTextEntry = true
        secureTextField.isUserInteractionEnabled = false
        secureTextField.backgroundColor = UIColor.black
        
        // This is the critical part - we need to manipulate the layer hierarchy
        // exactly as in the working code
        
        // Add secure field to the view's parent (not the view itself)
        if let parentView = view.superview {
            parentView.addSubview(secureTextField)
            parentView.sendSubviewToBack(secureTextField)
            
            // Critical layer manipulation
            if let superlayer = view.layer.superlayer {
                superlayer.addSublayer(secureTextField.layer)
                if let secureSublayer = secureTextField.layer.sublayers?.last {
                    view.layer.removeFromSuperlayer()
                    secureSublayer.addSublayer(view.layer)
                }
            }
        }
        
        print("🛡️ [BGSecure] Component-level screenshot protection enabled")
        return secureTextField
    }
    
    static func disableProtection(textField: UITextField, originalView: UIView, originalSuperlayer: CALayer?) {
        // Restore the original layer hierarchy
        originalView.layer.removeFromSuperlayer()
        
        if let originalSuperlayer = originalSuperlayer {
            originalSuperlayer.addSublayer(originalView.layer)
        }
        
        // Remove the secure text field
        textField.removeFromSuperview()
        
        print("🛡️ [BGSecure] Component-level screenshot protection disabled")
    }
}

// Secure wrapper view for protecting specific React components

