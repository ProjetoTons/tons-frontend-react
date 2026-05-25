import { useNavigate } from "react-router-dom"
import { getUsuario } from "@/shared/api/authToken"
import { useScrollDirection } from "@/shared/lib/useScrollDirection"
import "../navbar-cliente/navbar.css"

function Navbar({ onOpenDrawer, onOpenMenu, compact, hideBookmark }) {
    const navigate = useNavigate();
    const usuario = getUsuario();
    const primeiroNome = usuario?.nome?.trim().split(" ")[0];
    const isScrollVisible = useScrollDirection();

    return (
        <nav className={`w-full font-inter flex items-center justify-between px-10 bg-[#F2F2F2] border-b-4 border-[#F7D708] ${compact ? "py-2" : "py-4"} navbar-scroll-animation ${isScrollVisible ? 'navbar-visible' : 'navbar-hidden'}`}>

            {/* Lado Esquerdo: Logo e Saudação */}
            <div className="flex items-center gap-8">
                <img
                    className={`${compact ? "w-[50px]" : "w-[100px]"} cursor-pointer`}
                    src="/logo-tons/Logo Hefestos Nome.png"
                    alt="Logo Ton's"
                    onClick={() => navigate("/portfolio")}
                />  

                <div className="flex items-center gap-6">
                    {primeiroNome && (
                        <p className="nome text-black font-medium">Olá, {primeiroNome}.</p>
                    )}
                </div>
            </div>

            {/* Lado Direito: Busca, Bookmark e Menu Hambúrguer */}
            <div className="flex items-center gap-5">

                {!usuario && (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                            className="group relative flex items-center gap-2 px-6 py-2 border-2 border-black bg-transparent hover:bg-black transition-all duration-300"
                        >
                            <span className="text-[12px] font-black uppercase tracking-[2px] text-black group-hover:text-[#F7D708] transition-colors">
                                Login
                            </span>
                        </button>

                        <button
                            onClick={() => navigate("/cadastro/cliente")}
                            className="group relative flex items-center gap-2 px-6 py-2 border-2 border-black bg-transparent hover:bg-black transition-all duration-300"
                        >
                            <span className="text-[12px] font-black uppercase tracking-[2px] text-black group-hover:text-[#F7D708] transition-colors">
                                Cadastro
                            </span>
                        </button>
                    </>
                )}

                {/* Ícone Bookmark (Itens Salvos) — só logado */}
                {usuario && !hideBookmark && (
                    <img
                        className="w-7 cursor-pointer hover:scale-110 transition-transform"
                        src="/icons/bookmark.png"
                        alt="Abrir itens salvos"
                        onClick={onOpenDrawer}
                    />
                )}

                {/* ÍCONE HAMBÚRGUER — só logado */}
                {usuario && (
                    <button
                        onClick={onOpenMenu}
                        className="flex flex-col gap-1.5 p-2 hover:bg-black/5 rounded-md transition-colors"
                    >
                        <div className="w-6 h-[2px] bg-black"></div>
                        <div className="w-6 h-[2px] bg-black"></div>
                        <div className="w-4 h-[2px] bg-black self-end"></div>
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Navbar;
