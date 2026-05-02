import { Link } from 'react-router-dom'

export default function PageNotFind() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>PÁGINA NÃO MAPEADA</h1>
      <p>Talvez você esteja escrevendo o nome da página errado</p>
      <Link
        to="/portfolio"
        style={{
          display: 'inline-block',
          marginTop: '1.5rem',
          padding: '0.75rem 1.5rem',
          background: '#000',
          color: '#F7D708',
          fontWeight: 'bold',
          textDecoration: 'none',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}
      >
        Voltar para a Home
      </Link>
    </div>
  )
}
