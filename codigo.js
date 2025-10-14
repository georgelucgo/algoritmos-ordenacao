

// IMPORTAÇÕES E CONFIGURAÇÕES INICIAIS
// Biblioteca para entrada de dados pelo terminal
const prompt = require("prompt-sync")();
// Biblioteca para medição de tempo de execução
const { performance } = require('perf_hooks');

// Variáveis globais para métricas dos algoritmos
var comparacoes = 0;  // Contador de comparações entre elementos
var trocas = 0;       // Contador de trocas/movimentações de elementos

// INTERFACE DO USUÁRIO - CONFIGURAÇÕES
console.clear();
console.log("=== MENU PRINCIPAL ===");

// Solicita o tamanho do vetor a ser ordenado
var tamanho = Number(prompt("Qual é o tamanho do vetor? "));
console.log(`O tamanho do vetor é: ${tamanho}`);

// Menu para seleção do tipo de vetor
console.log(
  "Escolha como quer gerar os números:\n 1- Aleatório \n 2- Ordenado \n 3- Inversamente Ordenado \n 4- Quase ordenado"
);
var geradorOpcao = Number(prompt("R: "));

// Configura número de execuções para cálculo da média
const runsInput = prompt("\n Quantas execuções por configuração? (padrão 5): ");
const RUNS = runsInput.trim() === "" ? 5 : Math.max(1, parseInt(runsInput, 10));

// GERADOR DE VETORES
function gerarVetor(tamanho, opcao) {
  let vetor = [];

  switch(opcao) {
    case 1: // Vetor com números aleatórios
      for (let i = 0; i < tamanho; i++) {
        vetor.push(Math.floor(Math.random() * 1000));
      }
      break;
    case 2: // Vetor já ordenado
      for (let i = 0; i < tamanho; i++) vetor.push(i);
      break;
    case 3: // Vetor ordenado decrescentemente
      for (let i = tamanho; i > 0; i--) vetor.push(i);
      break;
    case 4: // Vetor quase ordenado (90% ordenado, 10% embaralhado)
      for (let i = 0; i < tamanho; i++) vetor.push(i);
      for (let i = 0; i < Math.floor(tamanho / 10); i++) {
        const a = Math.floor(Math.random() * tamanho);
        const b = Math.floor(Math.random() * tamanho);
        [vetor[a], vetor[b]] = [vetor[b], vetor[a]];
      }
      break;
  }

  return vetor;
}

// Gera o vetor baseado nas escolhas do usuário
var vetor = gerarVetor(tamanho, geradorOpcao);

// SELEÇÃO DO ALGORITMO DE ORDENAÇÃO
console.log(
  "\nEscolha o algoritmo de ordenação:\n 1- BubbleSort \n 2- SelectionSort \n 3- InsertionSort \n 4- MergeSort \n 5- QuickSort \n 6- HeapSort \n 7- Todos\n"
);
var algoritmoOpcao = Number(prompt("R:"));

// IMPLEMENTAÇÕES DOS ALGORITMOS DE ORDENAÇÃO
//  BUBBLE SORT - Otimizado com flag de controle
function bubbleSort(array) {
  comparacoes = 0;
  trocas = 0;
  for (let n = 0; n < array.length; n++) {
    let troca = false;
    for (let i = 0; i < array.length - 1; i++) {
      comparacoes++;
      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        trocas++;
        troca = true;
      }
    }
    if (!troca) break; // Se não houve trocas, o array está ordenado
  }
  return { vetor: array, comparacoes, trocas };
}
//  SELECTION SORT - Versão com seleção dupla (min e max)
function selectionSort(vetor) {
  comparacoes = 0;
  trocas = 0;
  let inicio = 0, fim = vetor.length - 1;

  while (inicio < fim) {
    let indiceMin = inicio;
    let indiceMax = fim;

    // Compara e troca os elementos das extremidades se necessário
    comparacoes++;
    if (vetor[indiceMin] > vetor[indiceMax]) {
      [vetor[indiceMin], vetor[indiceMax]] = [vetor[indiceMax], vetor[indiceMin]];
      trocas++;
    }

    // Encontra os índices do menor e maior elemento no segmento
    for (let i = inicio + 1; i < fim; i++) {
      comparacoes++;
      if (vetor[i] < vetor[indiceMin]) indiceMin = i;
      else if (vetor[i] > vetor[indiceMax]) indiceMax = i;
    }

    // Coloca o menor elemento no início
    if (indiceMin !== inicio) {
      [vetor[inicio], vetor[indiceMin]] = [vetor[indiceMin], vetor[inicio]];
      trocas++;
    }
    
    // Ajusta o índice do maior elemento se necessário
    if (indiceMax === inicio) indiceMax = indiceMin;
    
    // Coloca o maior elemento no final
    if (indiceMax !== fim) {
      [vetor[fim], vetor[indiceMax]] = [vetor[indiceMax], vetor[fim]];
      trocas++;
    }

    inicio++;
    fim--;
  }

  return { vetor, comparacoes, trocas };
}
//  INSERTION SORT - Com busca binária para encontrar posição
function buscaBinaria(array, valor, inicio, fim) {
  if (inicio === fim) {
    comparacoes++;
    return array[inicio] > valor ? inicio : inicio + 1;
  }

  let meio = Math.floor((inicio + fim) / 2);
  comparacoes++;
  if (array[meio] < valor) return buscaBinaria(array, valor, meio + 1, fim);
  else return buscaBinaria(array, valor, inicio, meio);
}

function InsertionSort(array) {
  comparacoes = 0;
  trocas = 0;
  for (let i = 1; i < array.length; i++) {
    let valor = array[i];
    // Encontra a posição correta usando busca binária
    let j = buscaBinaria(array, valor, 0, i - 1);
    let k = i;
    // Desloca os elementos para abrir espaço
    while (k > j) {
      array[k] = array[k - 1];
      k--;
      trocas++;
    }
    array[j] = valor;
  }
  return { vetor: array, comparacoes, trocas };
}
//  MERGE SORT - Implementação in-place
function mergeInPlace(array, inicio, meio, fim) {
  let inicioMerge = meio + 1;

  comparacoes++;
  if (array[meio] <= array[inicioMerge]) return; // Já está ordenado

  while (inicio <= meio && inicioMerge <= fim) {
    comparacoes++;
    if (array[inicio] <= array[inicioMerge]) {
      inicio++;
    } else {
      let valor = array[inicioMerge];
      let i = inicioMerge;
      // Desloca elementos para direita
      while (i != inicio) {
        array[i] = array[i - 1];
        i--;
        trocas++;
      }
      array[inicio] = valor;
      inicio++;
      meio++;
      inicioMerge++;
    }
  }
}

function mergeSort(array, inicio = 0, fim = array.length - 1) {
  if (inicio >= fim) return;
  const meio = Math.floor((inicio + fim) / 2);
  mergeSort(array, inicio, meio);
  mergeSort(array, meio + 1, fim);
  mergeInPlace(array, inicio, meio, fim);
  return { vetor: array, comparacoes, trocas };
}
//  QUICK SORT - Com pivô aleatório para melhor performance
function particionar(array, inicio, fim) {
  // Escolhe pivô aleatório para evitar worst-case
  const rand = inicio + Math.floor(Math.random() * (fim - inicio + 1));
  [array[rand], array[fim]] = [array[fim], array[rand]];
  trocas++; 

  const pivo = array[fim];
  let i = inicio - 1;
  
  // Particiona o array around do pivô
  for (let j = inicio; j < fim; j++) {
    comparacoes++;
    if (array[j] <= pivo) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      trocas++;
    }
  }
  // Coloca o pivô na posição correta
  [array[i + 1], array[fim]] = [array[fim], array[i + 1]];
  trocas++;
  return i + 1;
}

function quickSort(array, inicio = 0, fim = array.length - 1) {
  if (inicio < fim) {
    const pivoIndex = particionar(array, inicio, fim);
    quickSort(array, inicio, pivoIndex - 1);
    quickSort(array, pivoIndex + 1, fim);
  }
  return { vetor: array, comparacoes, trocas };
}
//  HEAP SORT - Ordenação usando estrutura de heap
function heapify(array, n, i) {
  let maior = i;
  const esquerda = 2 * i + 1;
  const direita = 2 * i + 2;

  // Encontra o maior entre pai e filhos
  if (esquerda < n) {
    comparacoes++;
    if (array[esquerda] > array[maior]) maior = esquerda;
  }
  if (direita < n) {
    comparacoes++;
    if (array[direita] > array[maior]) maior = direita;
  }
  
  // Se o maior não é o pai, troca e continua heapificando
  if (maior !== i) {
    [array[i], array[maior]] = [array[maior], array[i]];
    trocas++;
    heapify(array, n, maior);
  }
}

function heapSort(array) {
  comparacoes = 0;
  trocas = 0;
  const n = array.length;
  
  // Constrói o heap máximo
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) 
    heapify(array, n, i);
  
  // Extrai elementos do heap um por um
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    trocas++;
    heapify(array, i, 0);
  }
  return { vetor: array, comparacoes, trocas };
}

// SISTEMA DE MEDIÇÃO E ESTATÍSTICAS

//  Executa uma única rodada de teste
function RodadaUnica(func, arr) {
  const copia = [...arr];  // Cria cópia para não alterar o original
  comparacoes = 0;
  trocas = 0;
  const tempoinicio = performance.now();
  func(copia);
  const tempofinal = performance.now();
  return { 
    tempo: tempofinal - tempoinicio, 
    comparacoes, 
    trocas 
  };
}
//  Calcula a média de um conjunto de valores
function ConjuntoVetor(a) {
  if (a.length === 0) return 0;
  let soma = 0;
  for (const valor of a) {
    soma += valor;
  }
  return soma / a.length;
}
//  Calcula o desvio padrão de um conjunto de valores
function DesvioVetor(a) {
  const m = ConjuntoVetor(a);
  let somaQuadrados = 0;
  
  for (const valor of a) {
    somaQuadrados += (valor - m) ** 2;
  }
  
  return Math.sqrt(somaQuadrados / a.length);
}
//  Executa múltiplas rodadas e retorna estatísticas 
function Status(func, arr, runs = RUNS) {
  const tempos = [], comps = [], trocasArr = [];
  
  for (let i = 0; i < runs; i++) {
    const r = RodadaUnica(func, arr);
    tempos.push(r.tempo);
    comps.push(r.comparacoes);
    trocasArr.push(r.trocas);
  }
  
  return {
    tempo_medio: ConjuntoVetor(tempos),
    tempo_std: DesvioVetor(tempos),
    comp_medio: Math.round(ConjuntoVetor(comps)),
    troca_medio: Math.round(ConjuntoVetor(trocasArr))
  };
}

// APRESENTAÇÃO DE RESULTADOS

// Exibe resultados para um algoritmo específico 
function mostrarResultado(nome, func, vetorOriginal) {
  const status = Status(func, vetorOriginal, RUNS);
  console.log(`\n${nome} (média ${RUNS} runs):`);
  console.log(`Tempo: ${status.tempo_medio.toFixed(2)} ms  ± ${status.tempo_std.toFixed(2)}`);
  console.log(`Comparações (média): ${status.comp_medio}`);
  console.log(`Trocas/Movimentações (média): ${status.troca_medio}`);
}

// EXECUÇÃO PRINCIPAL

// Executa um único algoritmo selecionado
if (algoritmoOpcao >= 1 && algoritmoOpcao <= 6) {
  const algoritmos = {
    1: ["Bubble Sort", bubbleSort],
    2: ["Selection Sort", selectionSort],
    3: ["Insertion Sort", InsertionSort],
    4: ["Merge Sort", mergeSort],
    5: ["Quick Sort", quickSort],
    6: ["Heap Sort", heapSort],
  };
  const [nome, func] = algoritmos[algoritmoOpcao];
  mostrarResultado(nome, func, vetor);
}

// Executa e compara todos os algoritmos
if (algoritmoOpcao === 7) {
  const algoritmos = [
    { nome: "Bubble Sort", func: bubbleSort },
    { nome: "Selection Sort", func: selectionSort },
    { nome: "Insertion Sort", func: InsertionSort },
    { nome: "Merge Sort", func: mergeSort },
    { nome: "Quick Sort", func: quickSort },
    { nome: "Heap Sort", func: heapSort },
  ];

  const resultados = [];

  console.log("\n=== EXECUTANDO TODOS OS ALGORITMOS ===\n");
  
  // Testa cada algoritmo e coleta resultados
  for (const { nome, func } of algoritmos) {
    const estatisticas = Status(func, vetor, RUNS);
    
    console.log(`${nome} -> Tempo médio: ${estatisticas.tempo_medio.toFixed(2)} ms, Comparações: ${estatisticas.comp_medio}, Trocas: ${estatisticas.troca_medio}`);

    resultados.push({
      Algoritmo: nome,
      "Tempo (ms) média": estatisticas.tempo_medio.toFixed(2),
      "Tempo (ms) std": estatisticas.tempo_std.toFixed(2),
      "Comparações (média)": estatisticas.comp_medio,
      "Trocas/Movim. (média)": estatisticas.troca_medio,
    });
  }

  // Exibe informações complementares
  const resultadoFinal = [...vetor].sort((a, b) => a - b);
  console.log("\n=== RESUMO FINAL ===");
  console.log("\nVetor original:", vetor);
  console.log("Vetor ordenado:", resultadoFinal);
  console.log("\nTabela de Desempenho (Médias):");
  console.table(resultados);
}