---
title: "Welcome"
description: "这是往主页中添加内容的例子。"
---
<div class="katex-typing" aria-label="(Logic^0.5 × Chaos^0.5)^code > ∞+1">
    <span id="katex-text"></span>
</div>

<script>
document.addEventListener("DOMContentLoaded", () => {
    // 将公式拆分为正常文本和上标文本的组合
    const formulaParts = [
        { text: "(Logic", isSup: false },
        { text: "0.5", isSup: true },
        { text: " × Chaos", isSup: false },
        { text: "0.5", isSup: true },
        { text: ")", isSup: false },
        { text: "code", isSup: true },
        { text: " > ∞+1", isSup: false }
    ];

    const el = document.getElementById("katex-text");
    const fragment = document.createDocumentFragment();
    let charIndex = 0; // 用于累计动画延迟

    formulaParts.forEach(part => {
        // 如果是上标，先创建一个 sup 容器
        const container = part.isSup ? document.createElement("sup") : fragment;

        [...part.text].forEach(char => {
            const span = document.createElement("span");
            span.textContent = char;
            // 每一个字符按顺序递增延迟
            span.style.animationDelay = `${charIndex * 60}ms`;
            container.appendChild(span);
            charIndex++;
        });

        // 如果是上标，把 sup 容器塞进主片段里
        if (part.isSup) {
            fragment.appendChild(container);
        }
    });

    el.appendChild(fragment);
});
</script>