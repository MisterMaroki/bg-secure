class BgSecureView: UIView {
  private let imageView = UIImageView()
  
  init(color: UIColor = UIColor(red: 0x1b/255.0, green: 0x24/255.0, blue: 0x51/255.0, alpha: 1.0)) {
    super.init(frame: .zero)
    self.backgroundColor = color
    setupImageView()
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
    self.backgroundColor = UIColor(red: 0x1b/255.0, green: 0x24/255.0, blue: 0x51/255.0, alpha: 1.0)
    setupImageView()
  }
  
  private func setupImageView() {
    // Load the secure logo image
    if let image = UIImage(named: "SecureLogo") {
      imageView.image = image
      imageView.contentMode = .scaleAspectFit
      imageView.translatesAutoresizingMaskIntoConstraints = false
      
      addSubview(imageView)
      
      // Center the image and set a reasonable size
      NSLayoutConstraint.activate([
        imageView.centerXAnchor.constraint(equalTo: centerXAnchor),
        imageView.centerYAnchor.constraint(equalTo: centerYAnchor),
        imageView.widthAnchor.constraint(equalToConstant: 196),
        imageView.heightAnchor.constraint(equalToConstant: 196)
      ])
    }
  }
}