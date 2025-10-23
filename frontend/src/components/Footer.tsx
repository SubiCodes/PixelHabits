export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full border-t">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03]">
        <div className="grid grid-cols-12 h-full w-full">
          {[...Array(48)].map((_, i) => (
            <div
              key={i}
              className="aspect-square border border-foreground/10"
            />
          ))}
        </div>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-sm text-muted-foreground">
          <nav>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <li>
                <a 
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a 
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="font-mono">
            © {currentYear} Pixel Habits. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}