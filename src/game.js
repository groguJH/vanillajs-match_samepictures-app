import bugImage from "../images/bug.png";
import lionImage from "../images/lion.png";
import redPandaImage from "../images/redpanda.png";
import cardOpenSoundSrc from "../sounds/cardOpen.mp3";
import cardShuffleSoundSrc from "../sounds/cardShuffle.mp3";
import congratsSoundSrc from "../sounds/thankyou.mp3";

const GAME_TITLE = "같은 그림 맞추기";
const CLEAR_MESSAGE = "🎉축하해요 모두 맞췄어요🎉";
const images = [bugImage, lionImage, redPandaImage];

export function createMatchSamePicturesGame() {
  const headTitle = document.querySelector(".wrapper-title h2");
  const cards = Array.from(document.querySelectorAll(".card"));
  const shuffleButton = document.querySelector("#shuffle-button");

  const cardSelectSound = new Audio(cardOpenSoundSrc);
  const cardShuffle = new Audio(cardShuffleSoundSrc);
  const congrats = new Audio(congratsSoundSrc);

  let firstChoice = null;
  let secondChoice = null;
  let thirdChoice = false;

  cards.forEach((card) => {
    card.addEventListener("click", flipCard);
  });

  shuffleButton.addEventListener("click", initBoard);

  function playSound(audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  function shuffleCards() {
    const pairImages = [];
    const numPairs = cards.length / 2;

    for (let index = 0; index < numPairs; index += 1) {
      const image = images[index % images.length];
      pairImages.push(image, image);
    }

    for (let index = pairImages.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [pairImages[index], pairImages[randomIndex]] = [
        pairImages[randomIndex],
        pairImages[index],
      ];
    }

    cards.forEach((card, index) => {
      const cardBack = card.querySelector(".card-back");
      const img = document.createElement("img");
      const imageURL = pairImages[index];

      img.src = imageURL;
      img.alt = "";

      cardBack.replaceChildren(img);
    });
  }

  function checkClearCard() {
    const cardClears = cards.filter((card) => card.classList.contains("fade-out"));
    const totalCards = cards.length;

    if (cardClears.length === totalCards) {
      headTitle.textContent = CLEAR_MESSAGE;
      playSound(congrats);
    }
  }

  function checkMatch() {
    const firstImage = firstChoice.querySelector(".card-back img").src;
    const secondImage = secondChoice.querySelector(".card-back img").src;

    if (firstImage === secondImage) {
      setTimeout(() => {
        firstChoice.classList.add("fade-out");
        secondChoice.classList.add("fade-out");
        resetBoard();
        checkClearCard();
      }, 700);
      return;
    }

    setTimeout(() => {
      firstChoice.classList.remove("flipped");
      secondChoice.classList.remove("flipped");
      resetBoard();
    }, 700);
  }

  function flipCard(event) {
    const currentCard = event.currentTarget;

    if (thirdChoice) {
      return;
    }

    if (currentCard === firstChoice) {
      return;
    }

    if (currentCard.classList.contains("fade-out")) {
      return;
    }

    playSound(cardSelectSound);
    currentCard.classList.add("flipped");

    if (!firstChoice) {
      firstChoice = currentCard;
      return;
    }

    secondChoice = currentCard;
    thirdChoice = true;
    checkMatch();
  }

  function resetBoard() {
    firstChoice = null;
    secondChoice = null;
    thirdChoice = false;
  }

  function initBoard() {
    headTitle.textContent = GAME_TITLE;
    resetBoard();
    shuffleCards();
    playSound(cardShuffle);

    cards.forEach((card) => {
      card.classList.remove("flipped", "fade-out");
    });
  }

  return {
    initBoard,
  };
}
