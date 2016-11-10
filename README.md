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
* -Aplicar Sass com gulp e gulp-sass-
* -Adicionar library (bourbon)-
* -Gerar maps para os css e minificar na saída-
* -Aplicar o Handlebars-
  * -Configurar partials e a listagem automática de diretórios-
  * -Colocar no diretório de pages para a estrutura de páginas gerais-
* -Adicionar task ``watch`` e inserir Sass e Handlebars-
* Tasks a serem feitas:
  * Copy para fontes, imagens, vídeos, etc
  * Para minificação de Javascript
