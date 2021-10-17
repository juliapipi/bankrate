"use strict";
const puaseLogin = document.querySelector(".login-btn");
const eyeOp = document.querySelector(".eye-op");
const eyeCl = document.querySelector(".eye-cl");
const eyeOp2 = document.querySelector(".eye-open");
const eyeCl2 = document.querySelector(".eye-close");
const inputId = document.querySelector(".id-input");
const inputUser = document.querySelector(".user-input");

puaseLogin.addEventListener("click", function () {
  puaseLogin.href = "./account.html";
});

const eyeSwitch = function (op, cl) {
  op.classList.toggle("hidden");
  cl.classList.toggle("hidden");
};
eyeOp.addEventListener("click", function () {
  eyeSwitch(eyeOp, eyeCl);
  inputId.type = "text";
});
eyeCl.addEventListener("click", function () {
  eyeSwitch(eyeOp, eyeCl);
  inputId.type = "password";
});
eyeOp2.addEventListener("click", function () {
  eyeSwitch(eyeOp2, eyeCl2);
  inputUser.type = "text";
});
eyeCl2.addEventListener("click", function () {
  eyeSwitch(eyeOp2, eyeCl2);
  inputUser.type = "password";
});
