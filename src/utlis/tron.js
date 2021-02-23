import {Toast, Dialog} from 'vant'
import i18n from "../language"

const Env = require('@/env.js');

let tokenContractInstance;

function alt(msg = {}, callback = () => {}) {
    Dialog.alert({
        ...msg
    }).then(() => {
        callback();
    });
}

export function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

export function isAddress(address) {
    if (!address) {
        // 地址不能为空
        Toast(i18n.t('noAddressP'));
        return false;
    }
    return window.tronWeb.isAddress(address);
}

//获取到精度后值 value *( 10 ** decimal )
function getPowValue(value) {
    return Math.pow(10, Env.decimal) * value + '';
}

function toDecimal(value) {
    return value / Math.pow(10, Env.decimal);
}

//充值USDT 功能
export function deposit(amount) {
    amount = getPowValue(amount);
    return window.tronWeb.trx.sendTransaction(Env.contractAddress, amount)
        .then(res => {
            return Promise.resolve(res.txid);
        }).catch(err => {
            alt({message: i18n.t('rechargeFail')});
            return Promise.reject();
        })
}

//获取用户USDT余额
export function getAccountUSDTBalance() {
    let account = window.tronWeb.defaultAddress.base58;
    return tokenContractInstance.balanceOf(account).call().then(res => {
        return Promise.resolve(toDecimal(res));
    }).catch(err => {
        // alt({message: '獲取賬戶餘額失敗'});
        alt({message: i18n.t('errAccount')});
        return Promise.reject();
    })
}

export function getAccountTRXBalance() {
    let account = window.tronWeb.defaultAddress.base58;
    return window.tronWeb.trx.getBalance(account).then(res => {
        return Promise.resolve(toDecimal(res));
    }).catch(err => {
        alt({message: i18n.t('errAccount')});
        return Promise.reject();
    });
}

