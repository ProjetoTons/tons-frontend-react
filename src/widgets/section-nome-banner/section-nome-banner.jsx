function SectionNomeBanner() {

    return (
        <section className='w-full flex items-center flex-col'>
            <div className='w-[90%] mt-[50px]'>
                <h1 className="text-[var(--preto-neutro)] text-[15px] font-[var(--fonte-space)]">PÁGINA</h1>
                <h1 className="text-[var(--preto-neutro)] text-[55px] font-[var(--fonte-space)]">PORTFÓLIO</h1>

                <div className="w-[50px] h-[5px] bg-[var(--amarelo-base)] pl-[2%] mb-[10px]"></div>
                <p className="w-[60%] text-[var(--cinza-escuro)] font-[var(--fonte-inter)] mb-[10px]">
                    Seja bem-vindo ao nosso portfólio! Aqui, você encontrará todos os nossos trabalhos,
                     cuidadosamente criados para atender aos mais altos padrões de qualidade e design. 
                     Explore nossas categorias e descubra peças únicas que combinam estilo, funcionalidade 
                     e a essência da nossa marca.
                </p>
            </div>
        </section>
    )
}

export default SectionNomeBanner