import { Link } from 'react-router-dom'
import './styles1.css'

const navelems = ["Home", "Scan", "Resources"]
const navlinks = ["/", "/scan", "/resources"]

const Navbar = () => {
  return (
    <nav>
      <ul>
        {navelems.map((value, index) => (
          <li key={value}>
            <Link to={navlinks[index]}>{value}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
