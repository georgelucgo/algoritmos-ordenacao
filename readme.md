# Comparador de Algoritmos de Ordenação em JavaScript

Este projeto implementa e compara diversos algoritmos de ordenação em JavaScript, permitindo medir **tempo de execução**, **número de comparações** e **trocas/movimentações** dos elementos.

O objetivo é estudar o desempenho de cada algoritmo em diferentes tipos de vetores (aleatórios, ordenados, inversamente ordenados e quase ordenados).

---

## Algoritmos Implementados

1. **Bubble Sort** - Otimizado com flag de controle.
2. **Selection Sort** - Versão com seleção dupla (min e max).
3. **Insertion Sort** - Com busca binária para encontrar posição correta.
4. **Merge Sort** - Implementação in-place.
5. **Quick Sort** - Com pivô aleatório para evitar pior caso.
6. **Heap Sort** - Utiliza estrutura de heap máximo.
7. **Todos** - Executa todos os algoritmos para comparação.

---

## Funcionalidades

- **Geração de vetores**:
  - Aleatório
  - Ordenado
  - Inversamente ordenado
  - Quase ordenado (90% ordenado, 10% embaralhado)

- **Medição de desempenho**:
  - Tempo médio de execução
  - Desvio padrão do tempo
  - Média de comparações entre elementos
  - Média de trocas/movimentações

- **Execução múltipla**:
  - Permite rodar cada algoritmo várias vezes para obter médias confiáveis.

---

## Como usar

1. Clone ou baixe o projeto.
2. Instale a dependência `prompt-sync` caso não tenha:
3. Inicie com o node

```bash
npm install prompt-sync


