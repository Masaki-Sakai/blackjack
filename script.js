class card {
  //カードのclassを定義
  constructor(id, number, suit, cardImg) {
    this.id = id; //カードID
    this.number = number; //数
    this.suit = suit; //記号
    this.cardImg = cardImg;
  }
}

class player {
  //プレイヤーを定義
  constructor(name, cards = []) {
    this.name = name; //名前
    this.score = 0; //初期点数
    this.cards = cards; //持っているカードの配列
  }
}

class deck {
  //デッキを作成
  constructor() {
    this.cards = [];
  }
}

const gameCards = new deck();

//カード52枚を定義してデッキに入れる
let cardNumber = 1;
const suitArr = ['spade', 'club', 'diamond', 'heart'];
let suitNumber = 0;
while (suitNumber < 4) {
  for (let i = 0; i < 13; i++) {
    let cardImgNumber = i + 1;
    if (cardImgNumber < 10) {
      cardImgNumber = `0${cardImgNumber}`;
    }
    gameCards.cards.push(
      new card(cardNumber, i + 1, suitArr[suitNumber], `card_${suitArr[suitNumber]}_${cardImgNumber}`)
    );
    cardNumber++;
  }
  suitNumber++;
}

//プレイヤーの定義
const player1 = new player('YOU'),
  player2 = new player('CPU');

//要素の定義
const player1CardBox = document.getElementById('player1_card'),
  player1InfoBox = document.getElementById('player1_info'),
  player2CardBox = document.getElementById('player2_card'),
  player2InfoBox = document.getElementById('player2_info'),
  gameTxtBox = document.getElementById('game_txt'),
  hitBtn = document.getElementById('hit_btn'),
  standBtn = document.getElementById('stand_btn'),
  reloadBtn = document.getElementById('reload_btn');

//カードを引く
const drawCard = (player) => {
  //ランダムな数値を取得
  const drawCardNum = Math.floor(Math.random() * gameCards.cards.length);
  const drawCard = gameCards.cards[drawCardNum];
  //取得したカードの情報は消しておく
  gameCards.cards.splice([drawCardNum], 1);

  //プレイヤーのカード所持情報を更新する
  if (player === 'player1') {
    player1.cards.push(drawCard);
    showCard(player, player1.cards);
  } else {
    player2.cards.push(drawCard);
    showCard(player, player2.cards);
  }
};

//カード情報の表示
const showCard = (player, cards) => {
  let showCards = ''; //持ちカード画像の表示に使用
  let possessionCardCommon = 0; //手持ちカードの配列
  let possessionCardA = 0; //手持ちAカードの配列
  let cardScore = 0; //スコア

  //所持カード分だけfor分をまわす
  cards.forEach((value, index) => {
    //カード画像の追加
    if (player !== 'player1' && index !== 0) {
      showCards += `<img class="play_card"  src="./image/card/card_back.png">`;
    } else {
      showCards += `<img class="play_card" src="./image/card/${value.cardImg}.png">`;
    }

    //持ちカードの点数だけpossessionCardに格納
    if (value.number === 1) {
      possessionCardA++;
    } else if (IDBCursorWithValue.number > 10) {
      possessionCardCommon += 10;
    } else {
      possessionCardCommon += value.number;
    }
  });

  //Aの計算 と //点数の追加
  if (possessionCardA > 0) {
    if (possessionCardCommon + 11 + possessionCardA.length - 1 > 21) {
      cardScore += possessionCardA * 1;
    } else {
      cardScore += possessionCardCommon + 11;
      cardScore += possessionCardA - 1 * 1;
    }
  } else {
    cardScore += possessionCardCommon;
  }

  //HACK:もっとスマートにできないか
  if (player === 'player1') {
    player1CardBox.innerHTML = showCards;
    player1.score = cardScore;
    player1InfoBox.innerText = cardScore;
  } else {
    player2CardBox.innerHTML = showCards;
    player2.score = cardScore;
  }
};

//ゲームテキストの表示
const showGameText = (txt) => {
  gameTxtBox.innerText = txt;
};

//バースト判定
const burst = () => {
  if (player1.score > 21) {
    showGameText('YOU LOSE burst');
    endGame();
    return true;
  } else if (player2.score > 21) {
    showGameText('YOU WIN CPU burst');
    endGame();
    return true;
  }
  return false;
};

//勝利判定
const judge = () => {
  if (player1.score > player2.score) {
    showGameText('YOU WIN');
    endGame();
  } else if (player1.score < player2.score) {
    showGameText('YOU LOSE');
    endGame();
  } else {
    showGameText('DRAW');
    endGame();
  }
};

//ゲーム終了
const endGame = () => {
  console.log('endGame');
  player2InfoBox.innerText = player2.score;
  let showCards = '';
  player2.cards.forEach((value) => {
    //カード画像の追加
    showCards += `<img class="play_card" src="./image/card/${value.cardImg}.png">`;
  });
  player2CardBox.innerHTML = showCards;

  hitBtn.remove();
  standBtn.remove();
};

//Hitボタンを押したらカードを引く
hitBtn.onclick = () => {
  drawCard('player1');
  if (!burst()) {
    if (player2.score < 17) {
      drawCard('player2');
      burst();
    }
  }
};

//Standボタンを押したら勝負
standBtn.onclick = () => {
  judge();
};

//リロードボタンを押したらリロード
reloadBtn.onclick = () => {
  location.reload();
};

//ゲーム開始
drawCard('player1');
drawCard('player2');
drawCard('player1');
drawCard('player2');
console.log(gameCards);
