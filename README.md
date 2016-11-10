#Workflow para frontend usando Gulp

Esse workflow é um trabalho para simplificar o que utilizo com a equipe com quem trabalho, já feito com Grunt + Sass + Compass - por utilizar Sass + Compass ele precisa rodar o Ruby, o que cria uma camada a mais desnecessária para o cotidiano.

A ideia é utilizar nesse workflow:
* Geração de CSS minificado através com mixins, substituindo o Sass+Compass (``gulp-sass``, ``node-bourbon``, ``gulp-sourcemaps``);
* Gerar htmls através de includes com template engine (Handlebars), porém, o resultado final deverá ser estático;
* Levantar um servidor básico usando Express
* Fazer reload automático quando uma página for alterada (live preview)
* Testar, corrigir e minificar Javascript de Frontend
* Instalar libraries utilizando Bower ou similar
* Deixar apenas como pré-requisito o Node.js, Express.js e o Gulp.js, o resto serão módulos

##Instalação

Ao clonar o projeto você irá precisar realizar os dois itens abaixo.

Baixe o projeto e dê:

``npm install``

Caso não tenha o Gulp instalado:

``npm install gulp -g``

##Tarefas cadastradas

As tarefas estão em fase inicial, mas já dá pra utilizá-las para desenvolvimento.

###Converte Sass com Bourbon

``gulp sass``

Os arquivos são salvos na pasta ´´dist/css´´.

###Gera HTMLs utilizando o Handlebars.js

``gulp handlebars``

Ela gera os arquivos html que estão na pasta ``src/templates/pages``, mas pode usar os arquivos na pasta ``src/templates/partials`` para compor sua estrutura como *partiais* do *Handlebars.js*.

Os arquivos são salvos na pasta ´´dist´´.

###Vigia modificações nos arquivos

``gulp watch``

Essa é a tarefa principal, ela ficará rodando enquanto não for interrompida e processa todos os arquivos editados na pasta ``src``.

A tarefa vigia os arquivos da tarefa ``gulp-sass``, ``gulp-handlebars`` e ``gulp-fonts``. Toda vez que tem alteração em arquivos presentes nestas tasks (.hbs, .scss, .sass, etc) nas pastas específicas de cada uma ele as executa.

Depois de fazer qualquer modificação ela carrega um servidor e abre em seu navegador padrão o arquivo ``dist/main.html``. Isso acontece na porta 8080. Se quiser ver outros arquivos basta colocar a URL sempre partindo do diretório ``src``.

**Exemplos:**

```
localhost:8080/seuarquivo.html
localhost:8080/umdiretorio/seuarquivo.html
```


##Estrutura de pastas

```
dist (arquivos gerados pela task ``gulp deploy`` ou pela ``gulp-watch``)
  |_css
    |_ ...
  |_img
  |_js
    |_plugins
    |_vendors
    |_ ...
src
  |_scss
    |_ ...
  |_img
  |_js
    |_plugins
    |_vendors
    |_ ...
  |_templates
    |_data
    |_helpers
    |_pages
    |_partials
      |_molecules
```
##Lista de items para serem feitos
* ~~Aplicar Sass com gulp e gulp-sass~~
* ~~Adicionar library (bourbon)~~
* ~~Gerar maps para os css e minificar na saída~~
* ~~Aplicar o Handlebars~~
  * ~~Configurar partials e a listagem automática de diretórios~~
  * ~~Colocar no diretório de pages para a estrutura de páginas gerais~~
* ~~Adicionar task ``watch`` e inserir Sass e Handlebars~~
* Tasks a serem feitas:
  * Copy para:
    * ~~fontes~~,
    * imagens,
    * vídeos, etc
  * Para minificação de Javascript
  * Apagar itens automaticamente quando removidos ou alterados no src
  * Optimizar imagens
  * Colocar includes e bundle de javascripts
* Instalar o browser-sync
  * ~~Para html~~
  * ~~Para scss~~
  * Para imagens
  * Para Javascript
  * Para fontes
