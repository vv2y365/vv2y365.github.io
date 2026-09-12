---
title: "A title"
showDate: false
showReadingTime: false
showAuthor: false
showTaxonomies: false
showWordCount: false
showBreadcrumbs: false
showPagination: false
replyByEmail: false
---

<!-- <div class="memento-player" id="memento-player">
    <video
        id="memento-video"
        controls
        playsinline
        preload="none"
        width="2560"
        height="1440"
    >
        <source
            src="https://www.vyuyun.com/apiv1/api/linkurljump/6Qn5Fl/vwH-uCw_i_QyiHNVtEfekPtBX12iiqtesoYaWfL2vpE*"
            type="video/mp4"
        >
        当前浏览器不支持 HTML5 视频播放。
    </video>
    <div class="memento-player-controls">
        <span id="memento-status" role="status" aria-live="polite"></span>
        <button id="memento-fullscreen" type="button">网页全屏</button>
    </div>
</div> -->


<div class="memento-player" id="memento-player">
    <video
        id="memento-video"
        controls
        playsinline
        preload="none"
        width="2560"
        height="1440"
    >
        <source
            src="https://www.vyuyun.com/apiv1/api/linkurljump/K4mEFj/B1diKklfOFg7Hq-fXw27j8EupjcYidk8Vv8rA43vWDU*"
            type="video/mp4"
        >
        当前浏览器不支持 HTML5 视频播放。
    </video>
    <div class="memento-player-controls">
        <span id="memento-status" role="status" aria-live="polite"></span>
        <button id="memento-fullscreen" type="button">网页全屏</button>
    </div>
</div>

<style>
    .memento-player {
        width: 100%;
        margin: 2rem 0;
    }

    .memento-player video {
        display: block;
        width: 100%;
        height: auto;
        max-height: 75vh;
        background: #000;
    }

    /* Bilibili-style webscreen mode: keep the browser chrome, fill the viewport. */
    .memento-player.webscreen {
        position: fixed;
        z-index: 9999;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        margin: 0;
        background: #000;
    }

    .memento-player.webscreen video {
        width: 100%;
        height: 100%;
        max-height: none;
        object-fit: contain;
    }

    .memento-player-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-height: 2.75rem;
        padding: .5rem .75rem;
        color: #4887e6;
        background: rgba(255, 255, 255, 0);
        font-size: .85rem;
    }

    .memento-player.webscreen .memento-player-controls {
        position: absolute;
        right: 1rem;
        bottom: 1rem;
        left: 1rem;
        z-index: 1;
        color: #fff;
        background: rgba(255, 255, 255, 0);
    }

    #memento-fullscreen {
        border: 1px solid currentColor;
        padding: .35rem .7rem;
        color: inherit;
        background: transparent;
        cursor: pointer;
    }

    #memento-fullscreen:hover {
        color: #d85b38;
    }

    body.memento-webscreen-open {
        overflow: hidden;
    }

    @media (max-width: 640px) {
        .memento-player-controls {
            align-items: flex-start;
            flex-direction: column;
        }
    }
</style>

<script>
    (() => {
        const player = document.getElementById("memento-player");
        const video = document.getElementById("memento-video");
        const status = document.getElementById("memento-status");
        const fullscreenButton = document.getElementById("memento-fullscreen");

        if (!player || !video || !status || !fullscreenButton) return;

        video.addEventListener("waiting", () => {
            status.textContent = "正在缓冲视频...";
        });

        video.addEventListener("canplay", () => {
            status.textContent = "";
        });

        video.addEventListener("playing", () => {
            status.textContent = "";
        });

        video.addEventListener("stalled", () => {
            status.textContent = "网络响应较慢，请稍等片刻后继续播放。";
        });

        video.addEventListener("error", () => {
            status.textContent = "视频加载失败，请刷新页面后重试。";
        });

        const setWebscreen = (enabled) => {
            player.classList.toggle("webscreen", enabled);
            document.body.classList.toggle("memento-webscreen-open", enabled);
            fullscreenButton.textContent = enabled ? "退出网页全屏" : "网页全屏";
        };

        fullscreenButton.addEventListener("click", () => {
            setWebscreen(!player.classList.contains("webscreen"));
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && player.classList.contains("webscreen")) {
                setWebscreen(false);
            }
        });
    })();
</script>
