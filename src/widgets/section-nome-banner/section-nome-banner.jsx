function SectionNomeBanner() {

    return (
        <section className='w-full flex items-center flex-col px-4 sm:px-6 md:px-0'>
            <div className='w-full sm:w-[90%] mt-[30px] sm:mt-[50px]'>
                <h1 className="text-[12px] sm:text-[15px] text-[var(--preto-neutro)] font-[var(--fonte-space)]">PÁGINA</h1>
                <h1 className="text-[32px] sm:text-[48px] md:text-[55px] text-[var(--preto-neutro)] font-[var(--fonte-space)] leading-tight">PORTFÓLIO</h1>

                <div className="w-[50px] h-[5px] bg-[var(--amarelo-base)] pl-[2%] mb-[10px]"></div>
                <p className="w-full sm:w-[85%] md:w-[60%] text-xs sm:text-sm text-[var(--cinza-escuro)] font-[var(--fonte-inter)] mb-[10px] leading-relaxed">
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