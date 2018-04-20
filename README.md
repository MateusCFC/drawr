# Drawr

Aplicação de desenho usando Angular, a ser usado como prática na disciplina de tópicos para os cursos de Ciência da Computação, Engenharia de Software e Tecnologia da Informação da UFRN no semestre de 2018.1.

A versão base executável pode ser consultada em:
http://www.dimap.ufrn.br/~andre/spa/drawr/

Essa versão será focada na parte de "Desenho Livre". Nela, serão abordadas implementações de:
- Formas comumente utilizadas;
- Ferramentas que auxiliem ao desenho;
- Pré-customização de modos utilizados.

## Commits
### v1.1
- Adição de ferramenta de criação de círculos: o usuário clica na posição onde será o centro do círculo e, segurando o botão do mouse, arrasta o ponteiro, que faz com que o raio mude de acordo com a distância até o centro.

### v1.2
- Adição de ferramenta de criação de linhas retas: o usuário clica na posição onde será o começo da linha e, arrastando o indicador do mouse, faz com que uma linha seja gerada entre a primeira posição clicada e a posição atual do mouse.
- Círculo: correção na função pick;

### v1.2a
- Atualização da branch com as modificações feitas pelo professor, na master.

### v1.3
- Adição de ferramenta de criação de linhas de rabisco: o usuário clica na posição onde será o começo do rabisco e, ao arrastar o mouse, faz com que uma linha que segue o ponteiro do mouse, enquanto o botão estiver segurado, seja gerada.

### v1.4
- Adição de ferramenta de criação de estrelas: o usuário clica na posição onde deverá ser o centro da estrela, e ao clicar, a estrela é inserida.

### v1.4a
- Círculo: função pick definida para círculos não-cheios; função scale modificada para trabalhar apenas com escalas lineares.
- Linha: função scale criada (de forma similar a função scale do retângulo).
- Estrela: função pick criada (definida apenas para o círculo interno); função scale criada (de forma similar a função scale do círculo).

### v1.4b
- Rabisco: variável auxiliar, que armazena os pontos a medida que o rabisco era sendo criado, foi alterada de local. Previamente, estava no EditorService e, agora, está no CanvasDirective.
- Estrela: estrela padrão alterada não ser cheia por padrão, seguindo a base das outras ferramentas; função pick alterada para usar como referência o círculo externo da estrela;

### v1.5
- Adição de ferramenta de criação de triângulos: o usuário clica em três pontos consecutivos, que servirão de vértices para o triângulo.
- Serviço de ferramentas: adição de comando para limpar lista de pontos, salva na classe CanvasDirective, que armazena os pontos consecutivos das ferramentas Rabisco e Triângulo (feito para se evitar problemas com troca de função após clicar nos pontos). 

### v1.6
- Adição de ferramenta de criação de polígonos: o usuário clica em 4 (pré-definido) pontos, que servirão de vértices para o polígono.
- Triângulo: mudanças em comentários e identações
- Serviço de ferramenta: função alterada para escutar uma variável observável, que limpa as informações de pontos armazenados pela ferramenta Polígono caso o usuário escolha uma outra ferramenta durante a definição dos pontos do polígono.

## TO-DOs
- Rabisco e Triângulo: função scale.
- Círculo, Triângulo e Polígono: funções pick para o caso da figura preenchida.