---
title: "Welcome"
description: "一位高中生的个人网站 fun¹⁰ × int⁴⁰ = Ir²"
---
<div class="katex-typing" aria-label="(Logic^0.5 × Chaos^0.5)^code > ∞">
    <span id="katex-text"></span>
</div>

<script>
document.addEventListener("DOMContentLoaded", () => {
    
    const formulaParts = [
        { text: "(Logic", isSup: false },
        { text: "0.5", isSup: true },
        { text: " × Chaos", isSup: false },
        { text: "0.5", isSup: true },
        { text: ")", isSup: false },
        { text: "code", isSup: true },
        { text: " > ∞", isSup: false }
    ];

    const el = document.getElementById("katex-text");
    const fragment = document.createDocumentFragment();
    let charIndex = 0; 

    formulaParts.forEach(part => {
        const container = part.isSup ? document.createElement("sup") : fragment;

        [...part.text].forEach(char => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.animationDelay = `${charIndex * 60}ms`;
            container.appendChild(span);
            charIndex++;
        });

        if (part.isSup) {
            fragment.appendChild(container);
        }
    });

    el.appendChild(fragment);
});
</script>