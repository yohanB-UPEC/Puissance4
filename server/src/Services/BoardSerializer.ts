type BoardState = string;

// Fonction pour sérialiser l'état du plateau de jeu à partir d'une grille 2D
function serializeBoardState(grid: number[][]): BoardState {
  return grid.map(row => row.join('')).join('|');
}

// Fonction pour désérialiser l'état du plateau de jeu en une grille 2D
function deserializeBoardState(boardState: BoardState): number[][] {
  return boardState.split('|').map(row => row.split('').map(cell => parseInt(cell)));
}