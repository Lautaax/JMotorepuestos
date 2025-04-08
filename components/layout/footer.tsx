import type React from "react"

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container mx-auto py-4 text-center">
        <p>&copy; {new Date().getFullYear()} My Company. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
