import './destaque-banner.css'

function DestaqueBanner() {

    return (
        <section className='section'>
            <div className="spotlight">

                <img src="/logo-tons/ex-banner-ecobag.jpeg" alt="industrial" className="spotlight-img" />

                <div className="overlay"></div>

                <div className="content">
                    <span className="badge">ECO BAG</span>

                    <h1>
                        PRODUTOS <br />
                        DESTAQUE <br />
                        DO MÊS
                    </h1>

                    <p>
                        A seleção curada de acabamentos premium que estão
                        definindo o padrão visual desta temporada.
                    </p>

                    <button className="btn">
                        VER COLEÇÃO <span>→</span>
                    </button>
                </div>
            </div>
        </section>

    )
}

export default DestaqueBanner