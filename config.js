//可变化的
const siteConfig = {
    pageTitle: "跳转页",
    logoText: "与你相遇，好幸运",
    welcomeMessage: "快乐",
    quote: "Love is a fire that burns unseen.",
    quoteAuthor: "— William Shakespeare",
    navLinks: [
        { text: "新年快乐", url: "new_year/index.html" },
        { text: "情人节", url: "main.html" },
        { text: "520告白", url: "love_520/index.html" },
    ],
    love520: {
        pageTitle: "520 · 给乖乖的情书",
        dateBadge: "5 · 2 · 0",
        tag: "520来信",
        // 第一幕：逐条渐放大字（可改成 ["520"] 或 ["我","爱","你"]）
        zoomLines: ["5", "2", "0"],
        zoomDurationMs: 2400,
        zoomGapMs: 220,
        // 第二幕：主标题大字渐放
        heroLine: "我爱你",
        subtitle: "五月二十，谐音是我爱你。把这句话，只说给你听。",
        letterText:
            "乖乖，520 这天我想郑重地说一遍：我爱你。谢谢你愿意走进我的生活，陪我笑、陪我闹，也陪我慢慢长大。愿此后的每个日子，我都能做你最踏实的依靠，而你，永远是我心里最柔软的那一束光。",
        stageHint: "轻触屏幕 · 跳过动画",
        footer: "I Love You · 520 · 岁岁有你",
        restartBtnLabel: "再看一遍",
        typeSpeedMs: 48,
        typeDelayBeforeMs: 1600,
        contentTransitionMs: 700,
    },
    footerLinks: [
        { text: "One", url: "" },
        { text: "Two", url: "" },
        { text: "Three", url: "" }
    ]
};

window.onload = function() {
    const logo = document.querySelector('.logo');
    if (!logo) return;

    document.title = siteConfig.pageTitle;
    logo.innerHTML = siteConfig.logoText;
    document.querySelector('.welcome').innerHTML = siteConfig.welcomeMessage;
    document.querySelector('.quote').innerHTML = `"${siteConfig.quote}" <br> - ${siteConfig.quoteAuthor}`;

    updateDateTime();
    setInterval(updateTime, 1000);

    const navContainer = document.querySelector('.nav-buttons');
    siteConfig.navLinks.forEach(link => {
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.text;
        anchor.target = "_blank";
        navContainer.appendChild(anchor);
    });

    const footerContainer = document.querySelector('.footer');
    siteConfig.footerLinks.forEach(link => {
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.text;
        anchor.target = "_blank";
        footerContainer.appendChild(anchor);
    });
};

function updateTime() {
    const clockElement = document.querySelector('.clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.innerHTML = `${hours}:${minutes}:${seconds}`;
}

function updateDateTime() {
    const dateTimeElement = document.querySelector('.date-time-weather');
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
    const date = String(now.getDate()).padStart(2, '0');
    const day = now.getDay();
    const dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const formattedDate = `${year}年${month}月${date}日 ${dayNames[day]}`;

    const weatherInfo = ``;
    dateTimeElement.innerHTML = `${formattedDate} <br> ${weatherInfo}`;

    updateTime();
}
