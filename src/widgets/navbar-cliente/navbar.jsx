import { useNavigate } from "react-router-dom"
import { clearSession, getUsuario } from "@/shared/api/authToken"
import { useScrollDirection } from "@/shared/lib/useScrollDirection"
import "../navbar-cliente/navbar.css"

function Navbar({ onOpenDrawer, onOpenMenu, compact, hideBookmark }) {
    const navigate = useNavigate();
    const usuario = getUsuario();
    const primeiroNome = usuario?.nome?.trim().split(" ")[0];
    const isScrollVisible = useScrollDirection();

    const handleLogout = () => {
        clearSession();
        navigate("/portfolio");
    };

    return (
        <nav aria-label="Navegação do cliente" className={`w-full min-w-0 font-inter flex items-center justify-between gap-3 px-3 sm:px-6 md:px-10 bg-[#F2F2F2] border-b-4 border-[#F7D708] ${compact ? "py-2" : "py-4"} navbar-scroll-animation ${isScrollVisible ? 'navbar-visible' : 'navbar-hidden'}`}>

            {/* Lado Esquerdo: Logo e Saudação */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-4 md:gap-8">
                <img
                    className={`${compact ? "w-9 sm:w-[50px]" : "w-16 sm:w-[100px]"} shrink-0 cursor-pointer`}
                    src="/logo-tons/Logo Hefestos Nome.png"
                    alt="Logo Ton's"
                    onClick={() => navigate("/portfolio")}
                />  

                <div className="flex min-w-0 items-center gap-2 sm:gap-6">
                    {primeiroNome && (
                        <p className="max-w-[145px] truncate text-lg text-black font-medium sm:max-w-none sm:text-base md:text-[30px]" style={{ fontFamily: "var(--fonte-space)" }}>
                            Olá, {primeiroNome}.
                        </p>
                    )}
                </div>
            </div>

            {/* Lado Direito: Busca, Bookmark e Menu Hambúrguer */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 md:gap-5">

                {!usuario && (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                            className="group relative flex items-center gap-2 px-2 py-1.5 border border-black bg-transparent hover:bg-black transition-all duration-300 sm:px-4 sm:py-2 sm:border-2 md:px-6"
                        >
                            <span className="text-[9px] font-black uppercase tracking-wide text-black group-hover:text-[#F7D708] transition-colors sm:text-[12px] sm:tracking-[2px]">
                                Login
                            </span>
                        </button>

                        <button
                            onClick={() => navigate("/cadastro/cliente")}
                            className="group relative flex items-center gap-2 px-2 py-1.5 border border-black bg-transparent hover:bg-black transition-all duration-300 sm:px-4 sm:py-2 sm:border-2 md:px-6"
                        >
                            <span className="text-[9px] font-black uppercase tracking-wide text-black group-hover:text-[#F7D708] transition-colors sm:text-[12px] sm:tracking-[2px]">
                                Cadastro
                            </span>
                        </button>
                    </>
                )}

                {/* Ícone Bookmark (Itens Salvos) — só logado */}
                {usuario && !hideBookmark && (
                    <img
                        className="w-5 sm:w-7 cursor-pointer hover:scale-110 transition-transform"
                        src="/icons/bookmark.png"
                        alt="Abrir itens salvos"
                        onClick={onOpenDrawer}
                    />
                )}

                {usuario && (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="px-2 py-1.5 text-[9px] font-bold uppercase tracking-wide text-red-600 hover:text-red-700 transition-colors sm:px-3 sm:py-2 sm:text-[11px] md:hidden"
                        aria-label="Sair da conta"
                    >
                        Sair
                    </button>
                )}

                {/* ÍCONE HAMBÚRGUER — só logado. Esconde em telas móveis para usar o menu inferior */}
                {usuario && (
                    <button
                        onClick={onOpenMenu}
                        className="hidden md:flex flex-col gap-1.5 p-2 hover:bg-black/5 rounded-md transition-colors"
                    >
                        <div className="w-5 md:w-6 h-[2px] bg-black"></div>
                        <div className="w-5 md:w-6 h-[2px] bg-black"></div>
                        <div className="w-4 md:w-4 h-[2px] bg-black self-end"></div>
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Navbar;
