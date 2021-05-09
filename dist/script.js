document.addEventListener('DOMContentLoaded', function () {
    const i = document.getElementById('ph-input');
    const s = document.getElementById('ph-submit');
    const h = document.getElementById('ph-label');
    const phstatus = document.getElementById('ph-status');
    const r = document.getElementById('ph-reset');
    const container = document.getElementById('container');
    const background = document.getElementById('bg');
    const n = document.getElementById('notice');
    const lc = document.getElementById('l-con');
    const textl = document.createElement('h3');

    if (!container) {
        throw new Error('container 가 설정되지 않음!');
    }
    if (!lc) {
        throw new Error('list container 가 설정되지 않음!')
    }
    if (!s) {
        throw new Error('submitter 가 설정되지 않음!');
    }
    if (!r) {
        throw new Error('resetter 가 설정되지 않음!');
    }

    const couponMapPath = './data/coupon-map.json'

    let qr;

    const showQRcode = () => {
        textl.innerHTML = statusMan.couponName;
        container.appendChild(textl);
        const api = createAPI(ipn.value, statusMan.couponType);
        const qrf = async (api) => {
            const QRImg = await createQRImage('http://172.30.1.23:5000/' + api);
            container.appendChild(QRImg);
            qr = QRImg;
            lc.style.display = 'none'
        }
        qrf(api);
        window.scrollTo(0, document.body.scrollHeight);
    }
    const hideQRcode = () => {
        container.removeChild(textl);
        container.removeChild(qr);
        lc.style.display = '';
        statusMan.now = '$_calendar';
    }

    const showInputer = () => {
        if (statusMan.now !== '$_calendar' ?? '') {
            container.style.display = '';
            window.scrollTo(0, document.body.scrollHeight);
        }
        else {
            container.style.display = 'none';
        }
    }

    const statusMan = new StatusManager();
    (async () => {
        await statusMan.registerCouponMap(couponMapPath);

        statusMan.registerBackgroundImage(background);
        statusMan.registerListContainer(lc);
        statusMan.additionalCallback = showInputer;
        statusMan.now = '$_calendar';
    })();

    const ipn = new InputPhoneNumber(i, { dom: s, listener: showQRcode }, { dom: r, listener: hideQRcode }, { notice: n, phoneNum: h, status: phstatus });
});