# Doca das Porções

Crie um site moderno, dinâmico e mobile-first, em português do Brasil, para o bar "Doca das Porções" (Av. Nenê Sabino, 1285 – Uberaba/MG). Objetivo: atrair clientes e levar a pessoa a reservar mesa ou pedir pelo WhatsApp.

VISUAL: ambiente rústico de bar com música ao vivo: madeira escura, luzes penduradas, lampiões e cordas. Paleta vinho/bordô (cor do logo), dourado/âmbar e preto quente. Títulos grandes estilo letreiro, texto limpo. Use o logo e as fotos anexadas e crie imagens parecidas, no mesmo estilo (ambiente com luzes, porções, drinks, show ao vivo, espaço kids, bolo de aniversário), sem textos nas imagens. Use profundidade (sombras, camadas, parallax, brilho dourado).

ANIMAÇÕES: hero com título animado e luzes piscando suave, animações de entrada ao rolar, cards que viram ou aumentam ao toque, contadores animados, galeria em carrossel, quiz "Qual porção combina com você?" que leva ao WhatsApp e indicador "Aberto agora/Fechado" automático.

SEÇÕES (página única, menu fixo):
1. Hero com botões "Ver Agenda" e "Reservar no WhatsApp".
2. AGENDA DA SEMANA (destaque): um card por show com dia, data, artista, foto, horário e estilo. O dia atual aparece com selo "HOJE" e brilho, mais contagem regressiva para o próximo show. Cada card tem o botão "Reservar mesa", que abre o WhatsApp com mensagem pronta.
3. Cardápio: abas por categoria (Porções, Petiscos, Cervejas, Drinks, Sobremesas) com fotos e botão "Pedir" pelo WhatsApp. Use dados de exemplo.
4. Promoções, incluindo: "Aniversário no Doca: traga 20 ou mais pessoas e ganhe um bolo de 1,5 kg".
5. Espaço Kids.
6. Sobre o bar e galeria estilo Instagram, com botão para seguir @docadasporcoes.
7. Depoimentos.
8. Como chegar: mapa Google embutido (coordenadas -19.7540533, -47.9643394) e botão "Abrir no GPS".
9. Reservas: formulário (nome, data, horário, pessoas) que abre o WhatsApp preenchido.
10. Rodapé com redes sociais e botões iFood e 99Food.

PAINEL ADMIN (/admin, com login e senha, simples): eu crio, edito e excluo shows da semana (data, artista, foto, horário, estilo), uso "Duplicar semana anterior", envio a foto dos artistas e ativo ou desativo shows. Use banco de dados e autenticação (Lovable Cloud/Supabase) para as mudanças aparecerem no site na hora. O cardápio e as promoções também devem ser editáveis no admin.

DADOS: aberto todos os dias, seg a sáb 17h30–00h30 e domingo 16h30–23h30. WhatsApp/reservas: (34) 98428-0182, link https://wa.me/message/4C3DZSPIKSAWC1. Instagram: @docadasporcoes. Delivery: iFood e 99Food.

EXTRAS: botão flutuante do WhatsApp, textos curtos e bem-humorados, carregamento rápido, SEO local ("bar e porções em Uberaba/MG") e acabamento profissional.

Comece pela página inicial completa com a Agenda da Semana funcionando e o /admin.

Sites que podem complementar as informações: https://www.instagram.com/docadasporcoes/
https://maps.app.goo.gl/BPYqAvGArAQYh7Nb9

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1ec0804d-cc3a-4895-bc44-f69990f15756).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
