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
    ],
    footerLinks: [
        { text: "One", url: "" },
        { text: "Two", url: "" },
        { text: "Three", url: "" }
    ]
};

window.onload = function() {
    document.title = siteConfig.pageTitle;

    document.querySelector('.logo').innerHTML = siteConfig.logoText;
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
