/**
 * 全局声明
 */
declare global {
  interface Window {
    _hmt: any;
    wx: any;
  }
}

// 百度统计
interface ITrackPv {
  type: 'pv';
  pageURL?: string /** 指定要统计PV的页面URL。此项必选，必须是以”/”（斜杠）开头的相对路径 */;
}
interface ITrackEs {
  type: 'es';
  category: string /** 要监控的目标的类型名称，通常是同一组目标的名字，比如”视频”、”音乐”、”软件”、”游戏”等等。该项必选 */;
  action?: string /** 用户跟目标交互的行为，如”播放”、”暂停”、”下载”等等。该项必选。 */;
  opt_label?: string /** 事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项可选。 */;
  opt_value?: string /** 事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。 */;
}

class Tools {
  // 构造单例
  private static instance: Tools;
  private constructor() {}
  static defaultUtils() {
    if (!this.instance) {
      this.instance = new Tools();
    }
    return this.instance;
  }
  /**
   * 获取queryString参数值
   * @param name
   */
  public static query<T>(name?: string): T {
    const search = window.location.search;
    if (search) {
      const obj: Record<string, string> = {};
      search
        .slice(1)
        .split('&')
        .forEach((item: string) => {
          const arr = item.split('=');
          obj[arr[0]] = decodeURIComponent(arr[1]);
        });
      const res: unknown = name ? (obj[name] ? obj[name] : '') : obj;
      return res as T;
    } else {
      const res: unknown = name ? '' : {};
      return res as T;
    }
  }
  /**
   * 将对象转换为query参数
   * eg. {name: 'muzili', age: 30} ===> ?name=muzili&age=30
   * @param obj
   * @param hasPrefix 是否需要添加 `?` 前缀，默认true
   */
  public static convertToQueryWith(obj: Record<string, string | number | boolean>, hasPrefix = true) {
    if (!obj || Tools.toRawType(obj) !== 'object') return '';
    let res = hasPrefix ? '?' : '';
    Object.keys(obj).forEach((key: string) => {
      const v = obj[key];
      res += `${key}=${v !== undefined ? encodeURIComponent(v) : ''}&`;
    });
    if (res) {
      return res.slice(0, res.length - 1);
    }
    return res;
  }
  /**
   * 处理日期格式
   * @param timeStamp  时间错
   * @param format 格式
   */
  public static dateFormat(timeStamp: number, format?: string) {
    function formatNumber(n: number | string) {
      n = n.toString();
      return n[1] ? n : '0' + n;
    }

    const date = new Date(timeStamp);
    const year = formatNumber(date.getFullYear());
    const month = formatNumber(date.getMonth() + 1);
    const day = formatNumber(date.getDate());

    const hour = formatNumber(date.getHours());
    const minute = formatNumber(date.getMinutes());
    const second = formatNumber(date.getSeconds());

    if (format) {
      return format
        .replace('yyyy', year)
        .replace('mm', month)
        .replace('dd', day)
        .replace('hh', hour)
        .replace('mm', minute)
        .replace('ss', second);
    }
    let res = '';
    res += year + '-' + month + '-' + day + ' ';
    res += hour + ':' + minute + ':' + second;
    return res;
  }
  /**
   * 删除数组中的指定元素
   * @param arr
   * @param key
   * @param value
   */
  public static del<T>(arr: T[], key: keyof T, value: any): T[] {
    const tmp = [...arr];
    const index = tmp.findIndex((item: T) => item[key] === value);
    tmp.splice(index, 1);
    return tmp;
  }

  /**
   * 手机号码格式
   * @param phone
   * @param format space
   */
  public static phoneFormatter(phone: string, format: 'space' | 'encryption' = 'encryption') {
    if (phone.length !== 11) {
      return '';
    } else if (format === 'space') {
      return phone.replace(/(\d{3})(\d{4})(\d{4})/, `$1 $2 $3`);
    } else {
      return phone.replace(/(\d{3})(\d{4})(\d{4})/, `$1****$3`);
    }
  }

  /**
   * px转vw
   * @param pixel
   */
  public static px2vw(pixel: number): string {
    return `${(pixel / 375) * 100}vw`;
  }
  /**
   * 复制内容至剪贴板
   */
  public static clipboard(value: string) {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.setAttribute('style', 'display: block; width: 1px; height: 1px;');
      input.setAttribute('readonly', 'readonly');
      input.setAttribute('value', value);
      document.body.appendChild(input);
      input.setSelectionRange(0, Infinity);
      input.select();
      const result = document.execCommand('copy');
      document.body.removeChild(input);
      if (result) {
        resolve(null);
      } else {
        reject();
      }
    });
  }

  /**
   * 时间倒计时（返回时分秒）
   * @param timeStamp 时间戳
   * @param format    返回格式 dd hh:mm:ss，不传则返回元组类型[天,时,分,秒]
   * @param type      倒计时格式 default/秒制；ms/毫秒制
   * @param pending   倒计时持续状态
   * @param complete  倒计时结束
   */
  public static timeDown(params: {
    timeStamp: number;
    format?: string;
    type?: 'default' | 'ms';
    pending: (time: string | string[]) => void;
    complete: () => void;
  }) {
    // 处理时间格式
    function formatNumber(n: number | string) {
      n = n.toString();
      return n[1] ? n : '0' + n;
    }
    // 解构参数
    let { timeStamp, format, type = 'default', pending, complete } = params;
    const interval = type === 'default' ? 1000 : 100;
    if (timeStamp <= 0) {
      complete();
    } else {
      const tick = () => {
        timeStamp -= interval;
        const day = formatNumber(Math.floor(timeStamp / 1000 / 60 / 60 / 24));
        const hours = formatNumber(Math.floor((timeStamp / 1000 / 60 / 60) % 24));
        const minutes = formatNumber(Math.floor((timeStamp / 1000 / 60) % 60));
        const seconds = formatNumber(Math.floor((timeStamp / 1000) % 60));
        const millisecond = formatNumber(Math.floor((timeStamp % 1000) / 100));
        let res: string | string[];
        // 判断是否格式返回
        if (format) {
          res = format
            .replace(/dd/gi, day)
            .replace(/hh/gi, hours)
            .replace(/mm/gi, minutes)
            .replace(/ss/gi, seconds)
            .replace(/ms/gi, millisecond);
        } else {
          res = type === 'default' ? [day, hours, minutes, seconds] : [day, hours, minutes, seconds, millisecond];
        }
        if (timeStamp <= 0) {
          clearInterval(timer);
          complete();
        } else {
          pending(res);
        }
      };
      tick();
      const timer = setInterval(tick, interval);
      return timer;
    }
  }

  /**
   * 获取数据类型
   * @param target
   */
  public static toRawType(target: any) {
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
  }

  /**
   * 百度统计
   * @param options
   */
  public static track(options: ITrackPv | ITrackEs) {
    if (window._hmt) {
      switch (options.type) {
        case 'pv':
          window._hmt.push(['_trackPageview', options.pageURL || location.pathname]);
          break;
        case 'es':
          window._hmt.push([
            '_trackEvent',
            options.category,
            options.action || 'click',
            options.opt_label,
            options.opt_value,
          ]);
          break;
      }
    }
  }
  /**
   * 随机字符
   * @param length
   * @param type
   */
  public static randomCharacters(length: number, type?: 'default' | 'uppercase' | 'lowercase' | 'digital') {
    type = type || 'default';
    let bStr = '';
    switch (type) {
      case 'digital':
        bStr += '0123456789';
        break;
      case 'uppercase':
        bStr += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        break;
      case 'lowercase':
        bStr += 'abcdefghijklmnopqrstuvwxyz';
        break;
      default:
        bStr += '0123456789';
        bStr += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        bStr += 'abcdefghijklmnopqrstuvwxyz';
    }
    let rStr = '';
    for (let i = 0; i < length; ++i) {
      const index = Math.floor(Math.random() * bStr.length);
      rStr += bStr.slice(index, index + 1);
    }
    return rStr;
  }
  /**
   * 获取指定范围内的随机数
   * @param min
   * @param max
   */
  public static randomDecimals(min: number, max: number) {
    // 异常处理
    if (min === undefined || max === undefined || isNaN(min) || isNaN(max)) {
      return -1;
    } else {
      return Math.random() * (max - min) + min;
    }
  }
  /**
   * 获取指定范围内的随机整数
   * @param min
   * @param max
   */
  public static randomInteger(min: number, max: number) {
    if (min === undefined || max === undefined || isNaN(min) || isNaN(max)) {
      return -1;
    } else {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
  /**
   * 全屏
   */
  public static launchFullscreen() {
    const el: any = document.documentElement;
    const rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (typeof rfs !== 'undefined' && rfs) {
      rfs.call(el);
    }
    return;
  }
  /**
   * 退出全屏
   */
  public static exitFullscreen() {
    if (document.fullscreenElement) {
      const el: any = document;
      const cfs = el.exitFullscreen || el.mozCancelFullScreen || el.webkitCancelFullScreen || el.msExitFullscreen;
      if (typeof cfs !== 'undefined' && cfs) {
        cfs.call(el);
      }
    }
  }

  /**
   * Blob流转Excel
   * @param data 流
   * @param fileName 导出文件名
   */
  public static exportExcel(data: Blob, fileName: string) {
    return new Promise((resolve, reject) => {
      if (data.type === 'application/vnd.ms-excel') {
        const blob = new Blob([data], { type: 'application/xlsx' });
        const objectURL = URL.createObjectURL(blob);
        let a: HTMLAnchorElement | null = document.createElement('a');
        a.download = fileName + '.xlsx';
        a.href = objectURL;
        a.click();
        URL.revokeObjectURL(objectURL);
        a = null;
        resolve(1);
      } else {
        reject(0);
      }
    });
  }

  /**
   * 获取年份集合
   * @param start 开始年/默认值：1970
   * @param end 结束年/默认值：当前年
   * @returns
   */
  public static getYears(start: number = 1970, end: number = new Date().getFullYear()) {
    const years: string[] = [];
    for (let i = start; i <= end; i++) {
      years.push(`${i.toString()}年`);
    }
    return years;
  }
  /**
   * 获取月份集合：[1-12]
   * @returns
   */
  public static getMonths() {
    const months: string[] = [];
    for (let i = 1; i <= 12; i++) {
      months.push((i < 10 ? `0${i}` : i.toString()) + '月');
    }
    return months;
  }
  /**
   * 获取某月的天数集合
   * @param options 可选项/如果赋值，则表示获取精确天数，默认为31天即[1-31]
   * @returns
   */
  public static getDays(options?: { year: number; month: number }) {
    const days: string[] = [];
    let max = 31;
    if (options) {
      const { year, month } = options;
      if ([4, 6, 9, 11].indexOf(month) !== -1) {
        max = 30;
      } else if (month === 2) {
        // 计算是否闰年
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          max = 29;
        } else {
          max = 28;
        }
      }
    }
    for (let i = 1; i <= max; i++) {
      days.push((i < 10 ? `0${i}` : i.toString()) + '日');
    }
    return days;
  }
  /**
   * 批量下载文件
   * @param urls 文件地址
   * @returns
   */
  public static downloadFiles(urls: string[]) {
    if (!urls || (urls && urls.length === 0)) return;
    // create iframe element func.
    const createIFrame = (url: string, triggerDelay: number, removeDelay: number) => {
      setTimeout(function () {
        const i = document.createElement('iframe');
        i.style.display = 'none';
        i.setAttribute('src', url);
        document.body.appendChild(i);
        setTimeout(function () {
          i.remove();
        }, removeDelay);
      }, triggerDelay);
    };
    let triggerDelay = 100;
    let removeDelay = 1000;
    urls.forEach((url, index) => {
      createIFrame(url, index * triggerDelay, removeDelay);
    });
  }
}
export default Tools;
