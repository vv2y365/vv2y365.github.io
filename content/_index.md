---
title: "Welcome"
description: "这是往主页中添加内容的例子。"
---

<div class="katex-typing" aria-label="Code + Creativity = infinity">
    <span id="katex-text"></span>
</div>

<script>
document.addEventListener("DOMContentLoaded", () => {
    const text = "Code + Creativity = ∞";
    const el = document.getElementById("katex-text");

    const fragment = document.createDocumentFragment();

    [...text].forEach((char, i) => {
        const span = document.createElement("span");

        span.textContent = char;
        span.style.animationDelay = `${i * 60}ms`;

        fragment.appendChild(span);
    });

    el.appendChild(fragment);
});
</script>