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
- Adição da ferramenta de criação de círculos: o usuário clica na posição onde será o centro do círculo e, segurando o botão do mouse, arrasta o ponteiro, que faz com que o raio mude de acordo com a distância até o centro.

### v1.2
- Adição da ferramenta de criação de linhas retas: o usuário clica na posição onde será o começo da linha e, arrastando o indicador do mouse, faz com que uma linha seja gerada entre a primeira posição clicada e a posição atual do mouse.
- Correção de detecção da função pick de objetos do tipo círculo.

### v1.2a
- Atualização da branch com as modificações feitas pelo professor, na master.

### v1.3
- Adição de ferramenta de criação de linhas de rabisco: o usuário clica na posição onde será o começo do rabisco e, ao arrastar o mouse, faz com que uma linha que segue o ponteiro do mouse, enquanto o botão estiver segurado, seja gerada.
- Remoção das implementações da função scale da ferramenta linha: incerteza na implementação.

### v1.4
- Adição da ferramenta de criação de estrelas: o usuário clica na posição onde deverá ser o centro da estrela, e ao clicar, a estrela é inserida.

## TO-DOs
- Implementação da função scale: linha e rabisco.
- Pré-customização: estrela