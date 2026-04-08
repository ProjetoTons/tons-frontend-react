import './navbar.css'


function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">TON'S</div>

      <ul>
        <li className="active">PORTFÓLIO</li>
        <li>LISTA DE INTERESSE</li>
        <li>ITENS SALVOS</li>
      </ul>
    </nav>
  )
}

export default Navbar