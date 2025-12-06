// i18n translations and helper functions
const i18n = {
    "en": {
        "overlay_html": `<font size="7"><b>Web Installer under maintenance</b></font><br> The WLED web installer is currently out of service due to maintenance work and will be back online shortly.<br><br> In the meantime, you can use the webinstaller provided by Wladi: <a href="https://wled-install.github.io/">https://wled-install.github.io/</a>`,
        "welcome_text": `Welcome to the WLED web installer!`,
        "li1_text": `Plug in your ESP to a USB port. We will install WLED <span id="verstr"></span> to it.`,
        "li2_text": `Hit "Install" and select the correct COM port. <a onclick="showSerialHelp()">No device found?</a>`,
        "li3_text": `Get WLED installed and connected in less than 3 minutes!`,
        "install_button_text": `Install`,
        "unsupported_html": `Sorry, your browser is not yet supported!<br>\n    Please try on Desktop Chrome or Edge.<br>\n    Find binary files here:<br>\n    <a href="https://github.com/Aircoookie/WLED/releases" target="_blank">\n    <button class="btn" slot="activate">GitHub Releases</button>\n    </a>`,
        "serial_help_html": `Hit "Install" and select the correct COM port.<br><br>\n    You might be missing the drivers for your board.<br>\n    Here are drivers for chips commonly used in ESP boards:<br>\n    <a href="https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers" target="_blank">CP2102 (square chip)</a><br>\n    <a href="https://github.com/nodemcu/nodemcu-devkit/tree/master/Drivers" target="_blank">CH34x (rectangular chip)</a><br><br>\n    Make sure your USB cable supports data transfer.<br><br>\n    `,
    },
    "zh-CN": {
        "overlay_html": `<font size="7"><b>Web 安装程序正在维护</b></font><br> WLED Web 安装程序目前正在维护，稍后将重新上线。<br><br> 同时，您可以使用 Wladi 提供的 webinstaller：<a href="https://wled-install.github.io/">https://wled-install.github.io/</a>`,
        "welcome_text": `欢迎使用 WLED Web 安装程序！`,
        "li1_text": `将 ESP 插入到 USB 端口。我们将向其安装 WLED <span id="verstr"></span>。`,
        "li2_text": `点击“安装”并选择正确的 COM 端口。<a onclick="showSerialHelp()">未找到设备？</a>`,
        "li3_text": `在 3 分钟内完成 WLED 的安装并连接！`,
        "install_button_text": `安装`,
        "unsupported_html": `抱歉，您的浏览器尚不受支持！<br>\n    请在桌面端的 Chrome 或 Edge 上尝试。<br>\n    可在此处查找二进制文件：<br>\n    <a href="https://github.com/Aircoookie/WLED/releases" target="_blank">\n    <button class="btn" slot="activate">GitHub Releases</button>\n    </a>`,
        "serial_help_html": `点击“Install”并选择正确的 COM 端口。<br><br>\n    您可能缺少开发板的驱动程序。<br>\n    以下是常见于 ESP 开发板的芯片驱动程序：<br>\n    <a href="https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers" target="_blank">CP2102 (正方形芯片)</a><br>\n    <a href="https://github.com/nodemcu/nodemcu-devkit/tree/master/Drivers" target="_blank">CH34x (长方形芯片)</a><br><br>\n    请确保你的 USB 线支持数据传输。<br><br>\n    `,
    }
};

var currentLang = 'en';

// translation function
function t(key) {
    if (i18n[currentLang] && i18n[currentLang][key]) return i18n[currentLang][key];
    if (i18n['en'] && i18n['en'][key]) return i18n['en'][key];
    return '';
}

// apply translations to all elements with data-i18n attribute
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        var key = element.dataset.i18n;
        var val = t(key);
        if (val) element.innerHTML = val;
    });
    // set install button label
    var btn = document.querySelector('#inst button[slot="activate"]');
    if (btn) btn.textContent = t('install_button_text') || btn.textContent;
    // ensure version string stays in sync with select
    var sel = document.getElementById('ver');
    if (sel && document.getElementById('verstr')) {
        document.getElementById('verstr').textContent = sel.options[sel.selectedIndex].text;
    }
}

function switchLang(lang) {
    if (i18n[lang]) {
        currentLang = lang;
        localStorage.setItem('wled_lang', lang);
        applyTranslations();
    } 
}

function initI18n() {
    var saved = localStorage.getItem('wled_lang');
    // set current language to saved language or default to English
    currentLang = (saved && i18n[saved]) ? saved : 'en';
    var select = document.getElementById('langSelect');
    if (select) select.value = currentLang;
    applyTranslations();
}

// end i18n

function setManifest() {
    var sel = document.getElementById('ver');
    var opt = sel.options[sel.selectedIndex];
    var m = opt.dataset.manifest;
    var me = opt.dataset.ethernet;
    var ma = opt.dataset.audio;
    var mt = opt.dataset.test;
    var mv4 = opt.dataset.v4;
    var mdebug = opt.dataset.debug;

    //handle ethernet checkbox
    m = handleCheckbox(m, me, 'ethernet');
    //handle audioreactive checkbox
    m = handleCheckbox(m, ma, 'audio');
    //handle audioreactive checkbox
    m = handleCheckbox(m, mt, 'test');
    //handle v4 checkbox
    m = handleCheckbox(m, mv4, 'v4');
    //handle debug checkbox
    m = handleCheckbox(m, mdebug, 'debug');

    document.getElementById('inst').setAttribute('manifest', m);
    document.getElementById('verstr').textContent = opt.text;
}



function handleCheckbox(manifest, checkboxmanifest, primaryCheckbox) {
    //Check if specified manifest is available

    if (!checkboxmanifest) {
        document.getElementById(primaryCheckbox).disabled = true;
        document.getElementById(primaryCheckbox + "_label").classList.remove("radio__label");
        document.getElementById(primaryCheckbox + "_label").classList.add("disabled__label");
    } else {
        document.getElementById(primaryCheckbox + "_label").classList.remove("disabled__label");
        document.getElementById(primaryCheckbox + "_label").classList.add("radio__label");
    }


    if (checkboxmanifest && document.getElementById(primaryCheckbox).checked) {
        manifest = checkboxmanifest;
    }
    return manifest;
}

function resetCheckboxes() {
    document.getElementById('ethernet').checked = false;
    document.getElementById('ethernet').disabled = false;
    document.getElementById('audio').checked = false;
    document.getElementById('audio').disabled = false;
    document.getElementById('test').checked = false;
    document.getElementById('test').disabled = false;
    document.getElementById('v4').checked = false;
    document.getElementById('v4').disabled = false;
    document.getElementById('debug').checked = false;
    document.getElementById('debug').disabled = false;
}

function checkSupported() {
    if (document.getElementById('inst').hasAttribute('install-unsupported')) unsupported();
    else setManifest();
}

function unsupported() {
    document.getElementById('flasher').innerHTML = t('unsupported_html');
}

function showSerialHelp() {
    document.getElementById('coms').innerHTML = t('serial_help_html');
}
