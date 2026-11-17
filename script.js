
const screens = document.querySelectorAll(".screen");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");

let currentScreen = 1;
let currentQuestion = 0;
let revealedCoupons = 0;
let secretClicks = 0;
let secretFound = false;

const questions = [
  {
    question: "Qual é uma das habilidades mais impressionantes de uma mãe?",
    answers: [
      "Adivinhar o que está acontecendo só pelo olhar.",
      "Encontrar qualquer coisa em tempo recorde.",
      "Ter sempre uma opinião pronta."
    ],
    feedback: [
      "Habilidade avançada detectada. 👀",
      "GPS de mãe: precisão de 100%. 😂",
      "Essa funcionalidade nunca fica desativada. 😂"
    ]
  },
  {
    question: "O que acontece quando uma mãe diz 'depois a gente conversa'?",
    answers: [
      "Uma conversa tranquila e sem consequências.",
      "O sistema entra em estado de alerta.",
      "Todo mundo finge que não ouviu."
    ],
    feedback: [
      "Resposta otimista demais. 😂",
      "Exatamente! Alerta máximo ativado.",
      "Tentativa de fuga detectada. 😂"
    ]
  },
  {
    question: "Qual é o verdadeiro superpoder de uma mãe?",
    answers: [
      "Conseguir fazer várias coisas ao mesmo tempo.",
      "Saber de tudo antes de todo mundo.",
      "Cuidar de quem ama de um jeito único."
    ],
    feedback: [
      "Multitarefas em nível profissional. ✨",
      "Informações recebidas antes mesmo de acontecerem. 😂",
      "Resposta correta. Esse é o recurso mais especial de todos. ❤️"
    ]
  }
];

const coupons = [
  {
    icon: "🤗",
    title: "Vale um abraço!",
    description: "Resgatável a qualquer momento. Sem prazo de validade e com carinho ilimitado."
  },
  {
    icon: "🎬",
    title: "Vale escolher o filme!",
    description: "Você escolhe o filme e não vale reclamar da escolha. Aproveite a sessão!"
  },
  {
    icon: "☕",
    title: "Vale uma folga!",
    description: "Um momento para descansar e deixar algumas tarefas para depois. Você merece!"
  }
];

function showScreen(number) {
  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  const nextScreen = document.getElementById(`screen-${number}`);

  if (!nextScreen) return;

  nextScreen.classList.add("active");
  currentScreen = number;

  const progress = (number / 5) * 100;
  progressFill.style.width = `${progress}%`;

  const labels = {
    1: "INÍCIO",
    2: "TESTE DE SISTEMA",
    3: "FUNCIONALIDADES",
    4: "BENEFÍCIOS",
    5: "CONCLUÍDO"
  };

  progressText.textContent = labels[number];

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (number === 5) {
    launchConfetti();
  }
}

// Navegação entre as telas
document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => {
    const next = Number(button.dataset.next);
    showScreen(next);
  });
});

// Quiz
function loadQuestion() {
  const question = questions[currentQuestion];

  document.getElementById("question-counter").textContent =
    `PERGUNTA 0${currentQuestion + 1} DE 03`;

  document.getElementById("question-text").textContent =
    question.question;

  const answersContainer = document.getElementById("answers");
  const feedback = document.getElementById("quiz-feedback");

  feedback.textContent = "";
  answersContainer.innerHTML = "";

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.className = "answer-button";
    button.textContent = answer;

    button.addEventListener("click", () => {
      selectAnswer(index);
    });

    answersContainer.appendChild(button);
  });
}

function selectAnswer(index) {
  const question = questions[currentQuestion];
  const buttons = document.querySelectorAll(".answer-button");
  const feedback = document.getElementById("quiz-feedback");

  buttons.forEach(button => {
    button.disabled = true;
  });

  buttons[index].classList.add("selected");

  feedback.textContent = question.feedback[index];

  setTimeout(() => {
    currentQuestion++;

    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      currentQuestion = 0;
      showScreen(3);
    }
  }, 1700);
}

loadQuestion();

// Cupons
const couponModal = document.getElementById("coupon-modal");
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");

document.querySelectorAll("[data-coupon]").forEach(button => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.coupon);
    const coupon = coupons[index];

    if (!coupon) return;

    modalIcon.textContent = coupon.icon;
    modalTitle.textContent = coupon.title;
    modalDescription.textContent = coupon.description;

    couponModal.classList.add("open");
    couponModal.setAttribute("aria-hidden", "false");

    if (!button.classList.contains("revealed")) {
      button.classList.add("revealed");
      button.querySelector(".coupon-action").textContent = "DESBLOQUEADO";
      revealedCoupons++;

      document.getElementById("coupon-hint").textContent =
        revealedCoupons === 3
          ? "Todos os benefícios foram desbloqueados! 🎉"
          : `${revealedCoupons} de 3 benefícios desbloqueados.`;

      if (revealedCoupons === 3) {
        document.getElementById("coupon-continue").disabled = false;
      }
    }
  });
});

function closeCouponModal() {
  couponModal.classList.remove("open");
  couponModal.setAttribute("aria-hidden", "true");
}

document.getElementById("modal-close").addEventListener("click", closeCouponModal);
document.getElementById("modal-ok").addEventListener("click", closeCouponModal);

couponModal.addEventListener("click", event => {
  if (event.target === couponModal) {
    closeCouponModal();
  }
});

document.getElementById("coupon-continue").addEventListener("click", () => {
  if (revealedCoupons === 3) {
    showScreen(5);
  }
});

// Easter egg
const secretModal = document.getElementById("secret-modal");
const secretTrigger = document.getElementById("easter-egg-trigger");

secretTrigger.addEventListener("click", () => {
  if (secretFound) return;

  secretClicks++;

  if (secretClicks >= 5) {
    secretFound = true;
    secretModal.classList.add("open");
    secretModal.setAttribute("aria-hidden", "false");
    launchConfetti();
  } else {
    showToast(`${5 - secretClicks} cliques para desbloquear um segredo...`);
  }
});

function closeSecretModal() {
  secretModal.classList.remove("open");
  secretModal.setAttribute("aria-hidden", "true");
}

document.getElementById("secret-close").addEventListener("click", closeSecretModal);
document.getElementById("secret-ok").addEventListener("click", closeSecretModal);

secretModal.addEventListener("click", event => {
  if (event.target === secretModal) {
    closeSecretModal();
  }
});

// Mensagens rápidas
let toastTimeout;

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// Confetes
function launchConfetti() {
  const container = document.getElementById("confetti-container");
  const symbols = ["✦", "●", "◆", "♥"];
  const colors = ["#8d74b6", "#e8a9bd", "#d9c5eb", "#e8c78f", "#9bbba1"];

  container.innerHTML = "";

  for (let i = 0; i < 65; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti";
    piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    piece.style.left = `${Math.random() * 100}%`;
    piece.style.color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.fontSize = `${8 + Math.random() * 12}px`;
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;

    container.appendChild(piece);
  }

  setTimeout(() => {
    container.innerHTML = "";
  }, 6500);
}

// Reiniciar experiência
document.getElementById("restart-button").addEventListener("click", () => {
  currentQuestion = 0;
  revealedCoupons = 0;

  document.querySelectorAll(".coupon-card").forEach(button => {
    button.classList.remove("revealed");
    button.querySelector(".coupon-action").textContent = "TOQUE PARA REVELAR";
  });

  document.getElementById("coupon-hint").textContent =
    "Você pode revelar todos os benefícios!";

  document.getElementById("coupon-continue").disabled = true;

  loadQuestion();
  showScreen(1);
});
