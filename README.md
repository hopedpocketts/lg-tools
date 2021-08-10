# lg-tools

常用工具函数

# 安装

```shell
$ npm install lg-tools
# OR
$ yarn add lg-tools
```

# 使用

```typescript
import Tools from 'lg-tools';
```

# API

```tsx
/**
 * 获取queryString参数值
 * @param name
 */
static query<T>(name?: string): T;
/**
 * 将对象转换为query参数
 * eg. {name: 'muzili', age: 30} ===> ?name=muzili&age=30
 * @param obj
 * @param hasPrefix 是否需要添加 `?` 前缀，默认true
 */
static convertToQueryWith(obj: Record<string, string | number | boolean>, hasPrefix?: boolean): string;
/**
 * 将对象转为formData格式
 * @param object
 * @returns
 */
static convertToFormDataWith(object: Record<string, any>): FormData;
/**
 * 处理日期格式
 * @param v  时间戳 / 日期字符串 / 日期对象
 * @param format 格式
 */
static dateFormat(v: number | string | Date, format?: string): string;
/**
 * 删除数组中的指定元素
 * @param arr
 * @param key
 * @param value
 */
static del<T>(arr: T[], key: keyof T, value: any): T[];
/**
 * 对象数组根据指定key去重
 * @param arr
 * @param key
 * @returns
 */
static unique<T extends object>(arr: T[], key: keyof T): T[];
/**
 * 手机号码格式
 * @param phone
 * @param format space
 */
static phoneFormatter(phone: string, format?: 'space' | 'encryption'): string;
/**
 * px转vw
 * @param pixel
 */
static px2vw(pixel: number): string;
/**
 * 复制内容至剪贴板
 */
static clipboard(value: string): Promise<unknown>;
/**
 * 时间倒计时（返回时分秒）
 * @param timeStamp 时间戳
 * @param format    返回格式 dd hh:mm:ss，不传则返回元组类型[天,时,分,秒]
 * @param type      倒计时格式 default/秒制；ms/毫秒制
 * @param showDay   是否显示天 true-超过24小时天数+1；false-超过24小时累计小时值，默认为true
 * @param pending   倒计时持续状态
 * @param complete  倒计时结束
 */
static timeDown(params: {
    timeStamp: number;
    format?: string;
    type?: 'default' | 'ms';
    showDay?: boolean;
    pending: (time: string | string[]) => void;
    complete: () => void;
}): number | undefined;
/**
 * 获取数据类型
 * @param target
 */
static toRawType(target: any): string;
/**
 * 百度统计
 * @param options
 */
static track(options: ITrackPv | ITrackEs): void;
/**
 * 随机字符
 * @param length
 * @param type
 */
static randomCharacters(length: number, type?: 'default' | 'uppercase' | 'lowercase' | 'digital'): string;
/**
 * 获取指定范围内的随机数
 * @param min
 * @param max
 */
static randomDecimals(min: number, max: number): number;
/**
 * 获取指定范围内的随机整数
 * @param min
 * @param max
 */
static randomInteger(min: number, max: number): number;
/**
 * 全屏
 */
static launchFullscreen(): void;
/**
 * 退出全屏
 */
static exitFullscreen(): void;
/**
 * Blob流转Excel
 * @param data 流
 * @param fileName 导出文件名
 */
static exportExcel(data: Blob, fileName: string): Promise<unknown>;
/**
 * 获取年份集合
 * @param start 开始年/默认值：1970
 * @param end 结束年/默认值：当前年
 * @returns
 */
static getYears(start?: number, end?: number): string[];
/**
 * 获取月份集合：[1-12]
 * @returns
 */
static getMonths(): string[];
/**
 * 获取某月的天数集合
 * @param options 可选项/如果赋值，则表示获取精确天数，默认为31天即[1-31]
 * @returns
 */
static getDays(options?: {
    year: number;
    month: number;
}): string[];
/**
 * 批量下载文件
 * @param urls 文件地址
 * @returns
 */
static downloadFiles(urls: string[]): void;
/**
 * 处理数字小于10时的格式/在小于10的数字前面拼接0
 * @param num
 * @returns
 */
static numFormat(num: number): string;
/**
 * 获取当前运行环境
 * @returns
 * - android：安卓环境
 * - ios：iOS环境
 * - weixin：微信环境
 * - alipay：支付宝环境
 * - unknown：未知环境
 */
static getEnv(): "unknown" | "weixin" | "alipay" | "android" | "ios";
/**
 * 获取文件存储路径
 * 一般用于规范对象存储时的文件管理规范
 * 生成格式如下：存储目录名/日期/随机字符（3个）+时间戳_图片本身名字.后缀名
 * 示例：admin/avatar/20210630/ULK1625036350104_logo.png
 * @param file
 * @param dirName
 * @returns
 */
static getFilePath(file: File, dirName: string): string;
/**
 * url转base64
 * @param url
 * @returns
 */
static base64(url: string): Promise<unknown>;
```
