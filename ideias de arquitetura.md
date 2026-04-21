Guia de Arquiteturas de Software Modernas

1. Feature-Sliced Design (FSD)
A Feature-Sliced Design é uma metodologia moderna para organizar projetos frontend (especialmente em ecossistemas como React, Vue ou Next.js). Ela foca em decompor a aplicação por funcionalidades de negócio em vez de tipos de arquivos técnicos.

Camadas da FSD:
Shared: Recursos reutilizáveis e desacoplados (UI Kit, libs, helpers).

Entities: Entidades de negócio (ex: User, Product) com seus esquemas e lógica básica.

Features: Funcionalidades que entregam valor ao usuário (ex: AddToCart, ChangePassword).

Widgets: Componentes complexos que combinam múltiplas features e entidades.

Pages: Composição de widgets e features em telas completas.

Processes (Opcional): Lógicas complexas que atravessam múltiplas páginas.

App: Configurações globais, estilos e provedores.

Exemplo de Estrutura:
Plaintext
src/
├── app/                  # Providers, estilos globais
├── pages/                # Telas da aplicação (ex: CartPage, ProfilePage)
├── widgets/              # Blocos grandes (ex: Navbar, ProductGrid)
├── features/             # Ações do usuário (ex: AddToWishlist, AuthByEmail)
├── entities/             # Lógica de domínio (ex: User, Order)
│   ├── ui/               # Componentes visuais básicos da entidade
│   ├── model/            # State management (Redux/Zustand) e tipos
│   └── api/              # Requisições específicas da entidade
└── shared/               # UI Kit (Button, Input), hooks genéricos, API clients

----

2. Arquitetura em Camadas (Clean Arch)
Inspirada nos conceitos de Robert C. Martin, a Clean Architecture visa a independência de frameworks, UI e bancos de dados. O foco central é a Regra da Dependência: as dependências de código devem apontar apenas para dentro, em direção às regras de negócio.

Componentes Principais:
Domínio (Entidades e Casos de Uso): Contém o "coração" da aplicação. Não conhece nada sobre o mundo externo (APIs ou Banco de Dados).

Adapters (Interface Adapters): Converte dados do formato mais conveniente para as entidades para o formato mais conveniente para a UI ou Banco de Dados.

Infraestrutura (Frameworks & Drivers): Detalhes técnicos como o tipo de banco de dados, bibliotecas de terceiros e a interface de usuário.

Exemplo de Estrutura:
Plaintext
src/
├── core/
│   ├── domain/           # Entidades e Interfaces (Contracts)
│   └── use_cases/        # Regras de negócio puras (ex: RealizarVenda.ts)
├── data/
│   ├── repositories/     # Implementação dos contratos de dados
│   └── datasources/      # Chamadas diretas a APIs, Firebase ou SQLite
├── presentation/
│   ├── controllers/      # Gerenciamento de estado/lógica de exibição
│   └── ui/               # Componentes visuais (React/Flutter/Android)
└── main/                 # Composição da aplicação (Dependency Injection)

----

3. Atomic Design
O Atomic Design é uma metodologia para a criação de sistemas de design (Design Systems). Em vez de focar em páginas isoladas, ele constrói a interface de baixo para cima, garantindo consistência e reuso.

Hierarquia:
Átomos: Tags HTML básicas (Input, Botão, Label).

Moléculas: Grupos de átomos que funcionam juntos (ex: Campo de Busca = Input + Botão).

Organismos: Seções complexas da interface (ex: Header, Sidebar).

Templates: Estruturas de layout que definem onde os organismos ficam (o "esqueleto").

Páginas: Instâncias reais dos templates com conteúdo final.

Exemplo de Estrutura:
Plaintext
src/components/
├── atoms/
│   ├── Button/
│   ├── Input/
│   └── Icon/
├── molecules/
│   ├── SearchBar/        # Combina Input + Button
│   └── FormField/        # Combina Label + Input + ErrorMessage
├── organisms/
│   ├── Navbar/           # Combina Logo + SearchBar + NavLinks
│   └── ProductCard/      # Combina Image + PriceTag + AddButton
├── templates/
│   └── MainLayout/       # Define Header, Sidebar e Content Area
└── /
    └── HomePage/         # Implemepagesnta o template com dados reais